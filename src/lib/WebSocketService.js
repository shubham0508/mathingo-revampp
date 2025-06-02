class WebSocketService {
  constructor() {
    if (WebSocketService.instance) {
      return WebSocketService.instance;
    }

    this.socket = null;
    this.audioContext = null;
    this.gainNode = null;
    this.compressor = null;
    this.audioBufferQueue = [];
    this.processingBuffer = new Float32Array(0);
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.heartbeatInterval = 15000;
    this.listeners = {
      message: [],
      audio: [],
      audioStatusChange: [],
      error: [],
      connectionChange: [],
      heartbeat: [],
    };
    this.isPlaying = false;
    this.scheduledTime = 0;
    this.scheduledSources = [];
    this.isConnected = false;
    this.connecting = false;
    this.audioStatus = {
      isPlaying: false,
      queueLength: 0,
      isPaused: false,
      isMuted: false,
    };
    this.reconnectTimeout = null;
    this.heartbeatIntervalId = null;
    this.bufferSize = 4096;
    this.sampleRate = 24000;
    this.checkInterval = null;
    this.isStreamComplete = false;
    this.initialBufferTime = 0.1;

    this.handleMessage = this.handleMessage.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.attemptReconnect = this.attemptReconnect.bind(this);
    this.scheduleNextBuffer = this.scheduleNextBuffer.bind(this);
    this.addPCM16Data = this.addPCM16Data.bind(this);
    this.getAudioStatus = this.getAudioStatus.bind(this);

    WebSocketService.instance = this;
  }

  getAudioStatus() {
    return { ...this.audioStatus };
  }

  connect(serverUrl = null) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }
    if (this.connecting) {
      return;
    }

    if (this.socket) {
      try {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket.onclose = null;
        this.socket.close(1000, 'Client initiated reconnect');
      } catch (err) {}
      this.socket = null;
    }

    this.connecting = true;
    this.isStreamComplete = false;

    const wsProtocol =
      typeof window !== 'undefined' && window.location.protocol === 'https:'
        ? 'wss:'
        : 'ws:';
    const host =
      serverUrl ||
      (typeof window !== 'undefined'
        ? process.env.NEXT_PUBLIC_WEB_SOCKET_PATH || `${window.location.host}`
        : 'localhost:8000');
    const wsUrl = `${wsProtocol}//${host}/ws/ai_tutor`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.connecting = false;
        this.reconnectAttempts = 0;
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        this.notifyListeners('connectionChange', true);
        this.startHeartbeatMonitor();
      };

      this.socket.onmessage = this.handleMessage;
      this.socket.onerror = this.handleError;
      this.socket.onclose = this.handleClose;
    } catch (error) {
      this.notifyListeners('error', {
        message: 'Failed to initialize WebSocket connection.',
        details: error,
      });
      this.connecting = false;
    }
  }

  disconnect() {
    this.clearAllIntervals();
    this.closeSocketConnection('User initiated disconnect');
    this.resetAudioSystem();
    this.resetState();
    this.notifyListeners('connectionChange', false);
  }

  clearAllIntervals() {
    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  closeSocketConnection(reason = 'Connection closed by client') {
    if (this.socket) {
      if (reason.startsWith('User')) {
        this.socket.onclose = null;
      }
      try {
        this.socket.close(1000, reason);
      } catch (error) {}
      this.socket = null;
      this.isConnected = false;
    }
  }

  resetAudioSystem() {
    this.stopAudio();

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close().catch((e) => {});
      } catch (error) {}
    }
    this.audioContext = null;
    this.gainNode = null;
    this.compressor = null;
  }

  resetState() {
    this.audioBufferQueue = [];
    this.processingBuffer = new Float32Array(0);
    this.scheduledSources = [];
    this.scheduledTime = 0;
    this.isPlaying = false;
    this.isStreamComplete = false;
    const prevMuteState = this.audioStatus.isMuted;
    this.audioStatus = {
      isPlaying: false,
      queueLength: 0,
      isPaused: false,
      isMuted: prevMuteState,
    };
    this.reconnectAttempts = 0;
  }

  sendMessage(data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      const err = new Error('WebSocket not connected. Cannot send message.');
      this.notifyListeners('error', err);
      throw err;
    }

    if (!data.question) {
      const err = new Error('Missing "question" in message data.');
      this.notifyListeners('error', err);
      throw err;
    }

    try {
      const messagePayload = {
        question: data.question,
        solution: data.solution || 'no_input',
        feature: data.feature,
        audio_feedback: data.audio_feedback !== false,
        question_url: data.question_url || 'no_input',
        explanation: data.explanation,
        current_hint_index: data.current_hint_index,
        current_step_index: data.current_step_index,
        hint: data.hint,
        step: data.step,
      };
      Object.keys(messagePayload).forEach(
        (key) =>
          messagePayload[key] === undefined && delete messagePayload[key],
      );

      this.socket.send(JSON.stringify(messagePayload));
    } catch (error) {
      this.notifyListeners('error', error);
      throw error;
    }
  }

  pauseAudio() {
    if (
      !this.audioContext ||
      this.audioContext.state === 'closed' ||
      !this.isPlaying
    ) {
      return Promise.resolve(false);
    }
    if (this.audioContext.state === 'suspended') {
      this.audioStatus.isPaused = true;
      this.notifyListeners('audioStatusChange', { ...this.audioStatus });
      return Promise.resolve(true);
    }

    return this.audioContext
      .suspend()
      .then(() => {
        this.audioStatus.isPaused = true;
        this.notifyListeners('audioStatusChange', { ...this.audioStatus });
        return true;
      })
      .catch((err) => {
        this.notifyListeners('error', {
          message: 'Error pausing audio',
          details: err,
        });
        return false;
      });
  }

  resumeAudio() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.initAudioContext();
      if (!this.audioContext || this.audioContext.state === 'closed')
        return Promise.resolve(false);
    }
    if (this.audioContext.state === 'running' && this.isPlaying) {
      this.audioStatus.isPaused = false;
      this.notifyListeners('audioStatusChange', { ...this.audioStatus });
      return Promise.resolve(true);
    }

    if (
      !this.isPlaying &&
      (this.audioBufferQueue.length > 0 || this.processingBuffer.length > 0)
    ) {
      this.isPlaying = true;
    }

    return this.audioContext
      .resume()
      .then(() => {
        this.audioStatus.isPaused = false;
        this.notifyListeners('audioStatusChange', { ...this.audioStatus });
        if (this.isPlaying) {
          this.scheduledTime = Math.max(
            this.scheduledTime,
            this.audioContext.currentTime + this.initialBufferTime,
          );
          this.scheduleNextBuffer();
        }
        return true;
      })
      .catch((err) => {
        this.notifyListeners('error', {
          message: 'Error resuming audio',
          details: err,
        });
        return false;
      });
  }

  stopAudio() {
    if (!this.audioContext || this.audioContext.state === 'closed')
      return false;

    try {
      this.scheduledSources.forEach((source) => {
        try {
          source.onended = null;
          source.stop();
          source.disconnect();
        } catch (e) {}
      });
      this.scheduledSources = [];
      this.audioBufferQueue = [];
      this.processingBuffer = new Float32Array(0);
      this.isPlaying = false;
      this.isStreamComplete = true;
      this.scheduledTime = this.audioContext
        ? this.audioContext.currentTime
        : 0;

      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }

      if (
        this.gainNode &&
        this.gainNode.gain &&
        this.audioContext.state === 'running'
      ) {
        try {
          this.gainNode.gain.cancelScheduledValues(
            this.audioContext.currentTime,
          );
          this.gainNode.gain.setValueAtTime(
            this.gainNode.gain.value,
            this.audioContext.currentTime,
          );
          this.gainNode.gain.linearRampToValueAtTime(
            0,
            this.audioContext.currentTime + 0.05,
          );
          setTimeout(() => {
            if (
              this.gainNode &&
              this.audioContext &&
              this.audioContext.state === 'running'
            ) {
              this.gainNode.gain.setValueAtTime(
                this.audioStatus.isMuted ? 0 : 1,
                this.audioContext.currentTime,
              );
            }
          }, 60);
        } catch (e) {}
      }

      const prevMuteState = this.audioStatus.isMuted;
      this.audioStatus = {
        isPlaying: false,
        isPaused: false,
        isMuted: prevMuteState,
        queueLength: 0,
      };
      this.notifyListeners('audioStatusChange', { ...this.audioStatus });
      return true;
    } catch (error) {
      this.notifyListeners('error', {
        message: 'Error stopping audio',
        details: error,
      });
      return false;
    }
  }

  toggleMute() {
    if (
      !this.gainNode ||
      !this.audioContext ||
      this.audioContext.state === 'closed'
    )
      return false;

    try {
      const newMuteState = !this.audioStatus.isMuted;
      if (this.audioContext.state === 'running') {
        this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
        this.gainNode.gain.setValueAtTime(
          this.gainNode.gain.value,
          this.audioContext.currentTime,
        );
        this.gainNode.gain.linearRampToValueAtTime(
          newMuteState ? 0 : 1,
          this.audioContext.currentTime + 0.05,
        );
      } else {
        this.gainNode.gain.value = newMuteState ? 0 : 1;
      }
      this.audioStatus.isMuted = newMuteState;
      this.notifyListeners('audioStatusChange', { ...this.audioStatus });
      return true;
    } catch (error) {
      this.notifyListeners('error', {
        message: 'Error toggling mute',
        details: error,
      });
      return false;
    }
  }

  addListener(type, callback) {
    if (!this.listeners[type]) {
      return () => {};
    }
    this.listeners[type].push(callback);
    return () => {
      this.listeners[type] = this.listeners[type].filter(
        (cb) => cb !== callback,
      );
    };
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'heartbeat') {
        this.notifyListeners('heartbeat', data);
        return;
      }

      this.notifyListeners('message', data);

      if (
        data.status === 'success' &&
        data.data_type === 'audio' &&
        data.data
      ) {
        this.isStreamComplete = !!data.is_last_chunk;
        this.handleAudioData(data.data);
      } else if (data.type === 'audio_stream_complete') {
        this.completeAudioStreamProcessing();
      }
    } catch (error) {
      this.notifyListeners('error', {
        message: 'Failed to parse message or handle audio',
        details: error,
      });
    }
  }

  handleError(errorEvent) {
    this.notifyListeners('error', {
      message: 'WebSocket connection error. The connection may close.',
      details:
        errorEvent.message ||
        'No specific error message provided by the event.',
    });
  }

  handleClose(event) {
    this.isConnected = false;
    this.connecting = false;
    this.notifyListeners('connectionChange', false);

    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }

    if (
      event.code !== 1000 &&
      event.code !== 1005 &&
      this.reconnectAttempts < this.maxReconnectAttempts
    ) {
      this.attemptReconnect();
    } else if (event.code !== 1000 && event.code !== 1005) {
      const finalCloseMessage = `WebSocket closed abnormally (Code: ${event.code}). Max reconnects reached or unrecoverable error.`;
      this.notifyListeners('error', { message: finalCloseMessage });
    }
  }

  attemptReconnect() {
    if (this.connecting || this.isConnected) return;

    this.reconnectAttempts++;
    const delay =
      this.reconnectDelay *
      Math.pow(2, Math.min(this.reconnectAttempts - 1, 4));

    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isConnected && !this.connecting) {
        this.connect();
      }
    }, delay);
  }

  initAudioContext() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      if (
        typeof window !== 'undefined' &&
        (window.AudioContext || window.webkitAudioContext)
      ) {
        try {
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)({
            sampleRate: this.sampleRate,
            latencyHint: 'interactive',
          });
          this.setupAudioNodes();
        } catch (err) {
          this.notifyListeners('error', {
            message: 'AudioContext not supported or failed to initialize.',
            details: err,
          });
          this.audioContext = null;
        }
      } else {
        this.notifyListeners('error', {
          message: 'Web Audio API not supported.',
        });
      }
    }
  }

  setupAudioNodes() {
    if (!this.audioContext) return;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = this.audioStatus.isMuted ? 0 : 1;

    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    this.gainNode.connect(this.compressor);
    this.compressor.connect(this.audioContext.destination);
  }

  async handleAudioData(base64Data) {
    if (!base64Data) return;

    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.initAudioContext();
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.notifyListeners('error', {
          message: 'Audio context not available for handling audio data.',
        });
        return;
      }
    }
    if (this.audioContext.state === 'suspended') {
      await this.resumeAudio();
      if (this.audioContext.state === 'suspended') {
        this.notifyListeners('error', {
          message:
            'AudioContext is suspended. User interaction may be needed to play audio.',
        });
        return;
      }
    }

    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16Buffer = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Buffer.length);
      for (let i = 0; i < int16Buffer.length; i++) {
        float32Array[i] = int16Buffer[i] / 32768.0;
      }
      this.addPCM16Data(float32Array);
    } catch (error) {
      this.notifyListeners('error', {
        message: 'Error processing audio data',
        details: error,
      });
    }
  }

  addPCM16Data(float32Array) {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.initAudioContext();
      if (!this.audioContext || this.audioContext.state === 'closed') return;
    }

    const newBuffer = new Float32Array(
      this.processingBuffer.length + float32Array.length,
    );
    newBuffer.set(this.processingBuffer);
    newBuffer.set(float32Array, this.processingBuffer.length);
    this.processingBuffer = newBuffer;

    this.audioStatus.queueLength =
      Math.floor(this.processingBuffer.length / this.bufferSize) +
      this.audioBufferQueue.length;
    this.notifyListeners('audioStatusChange', { ...this.audioStatus });

    if (
      !this.isPlaying &&
      this.audioContext.state === 'running' &&
      this.processingBuffer.length >= this.bufferSize
    ) {
      this.isPlaying = true;
      this.audioStatus.isPlaying = true;
      this.scheduledTime =
        this.audioContext.currentTime + this.initialBufferTime;
      this.scheduleNextBuffer();
    } else if (this.isPlaying && this.audioContext.state === 'running') {
      if (
        this.scheduledSources.length === 0 &&
        this.audioBufferQueue.length === 0 &&
        this.processingBuffer.length >= this.bufferSize
      ) {
        this.scheduleNextBuffer();
      }
    }
  }

  createAudioBufferFromArray(audioData) {
    if (!this.audioContext || this.audioContext.state === 'closed')
      throw new Error('Audio context not available for creating buffer');
    try {
      const audioBuffer = this.audioContext.createBuffer(
        1,
        audioData.length,
        this.sampleRate,
      );
      audioBuffer.getChannelData(0).set(audioData);
      return audioBuffer;
    } catch (error) {
      this.notifyListeners('error', {
        message: 'Error creating audio buffer',
        details: error,
      });
      throw error;
    }
  }

  scheduleNextBuffer() {
    if (!this.audioContext || this.audioContext.state !== 'running') {
      if (this.checkInterval) clearInterval(this.checkInterval);
      this.checkInterval = null;
      return;
    }

    const SCHEDULE_AHEAD_TIME = 0.2;

    while (this.processingBuffer.length >= this.bufferSize) {
      const chunk = this.processingBuffer.slice(0, this.bufferSize);
      this.processingBuffer = this.processingBuffer.slice(this.bufferSize);
      try {
        const webAudioBuffer = this.createAudioBufferFromArray(chunk);
        this.audioBufferQueue.push(webAudioBuffer);
      } catch (e) {
        continue;
      }
    }

    while (
      this.audioBufferQueue.length > 0 &&
      this.scheduledTime < this.audioContext.currentTime + SCHEDULE_AHEAD_TIME
    ) {
      const webAudioBufferToPlay = this.audioBufferQueue.shift();

      const source = this.audioContext.createBufferSource();
      source.buffer = webAudioBufferToPlay;
      source.connect(this.gainNode);

      const startTime = Math.max(
        this.scheduledTime,
        this.audioContext.currentTime,
      );
      source.start(startTime);
      this.scheduledSources.push(source);
      this.scheduledTime = startTime + webAudioBufferToPlay.duration;

      source.onended = () => {
        this.scheduledSources = this.scheduledSources.filter(
          (s) => s !== source,
        );
        if (
          this.scheduledSources.length === 0 &&
          this.audioBufferQueue.length === 0 &&
          this.processingBuffer.length < this.bufferSize &&
          this.isStreamComplete
        ) {
          this.isPlaying = false;
          this.audioStatus.isPlaying = false;
          this.audioStatus.isPaused = false;
          this.audioStatus.queueLength = 0;
          this.notifyListeners('audioStatusChange', { ...this.audioStatus });
          if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
          }
        }
      };
    }

    this.audioStatus.isPlaying = this.isPlaying;
    this.audioStatus.queueLength =
      this.audioBufferQueue.length +
      Math.floor(this.processingBuffer.length / this.bufferSize);
    this.notifyListeners('audioStatusChange', { ...this.audioStatus });

    if (this.checkInterval) clearInterval(this.checkInterval);

    if (
      this.isPlaying &&
      (this.audioBufferQueue.length > 0 ||
        this.processingBuffer.length >= this.bufferSize ||
        (!this.isStreamComplete && this.processingBuffer.length > 0))
    ) {
      const timeUntilNextNeeded =
        (this.scheduledTime -
          this.audioContext.currentTime -
          SCHEDULE_AHEAD_TIME * 0.5) *
        1000;
      this.checkInterval = setTimeout(
        () => this.scheduleNextBuffer(),
        Math.max(50, timeUntilNextNeeded),
      );
    } else if (
      this.isStreamComplete &&
      this.processingBuffer.length > 0 &&
      this.processingBuffer.length < this.bufferSize &&
      this.audioBufferQueue.length === 0 &&
      this.scheduledSources.length === 0
    ) {
      if (this.processingBuffer.length > 0) {
        try {
          const lastChunkBuffer = this.createAudioBufferFromArray(
            this.processingBuffer,
          );
          this.processingBuffer = new Float32Array(0);
          this.audioBufferQueue.push(lastChunkBuffer);
          this.checkInterval = setTimeout(() => this.scheduleNextBuffer(), 50);
        } catch (e) {
          this.isPlaying = false;
          this.audioStatus.isPlaying = false;
          this.audioStatus.isPaused = false;
          this.audioStatus.queueLength = 0;
          this.notifyListeners('audioStatusChange', { ...this.audioStatus });
        }
      } else {
        this.isPlaying = false;
        this.audioStatus.isPlaying = false;
        this.audioStatus.isPaused = false;
        this.audioStatus.queueLength = 0;
        this.notifyListeners('audioStatusChange', { ...this.audioStatus });
      }
    } else if (
      this.isStreamComplete &&
      this.audioBufferQueue.length === 0 &&
      this.processingBuffer.length === 0 &&
      this.scheduledSources.length === 0
    ) {
      this.isPlaying = false;
      this.audioStatus.isPlaying = false;
      this.audioStatus.isPaused = false;
      this.audioStatus.queueLength = 0;
      this.notifyListeners('audioStatusChange', { ...this.audioStatus });
    } else if (!this.isStreamComplete && this.isPlaying) {
      this.checkInterval = setTimeout(() => this.scheduleNextBuffer(), 100);
    }
  }

  completeAudioStreamProcessing() {
    this.isStreamComplete = true;
    if (
      this.processingBuffer.length > 0 ||
      this.audioBufferQueue.length > 0 ||
      this.scheduledSources.length > 0
    ) {
      if (this.audioContext && this.audioContext.state === 'running') {
        if (!this.isPlaying) {
          this.isPlaying = true;
          this.audioStatus.isPlaying = true;
          this.scheduledTime =
            this.audioContext.currentTime + this.initialBufferTime;
        }
        this.scheduleNextBuffer();
      }
    } else {
      this.isPlaying = false;
      this.audioStatus.isPlaying = false;
      this.audioStatus.isPaused = false;
      this.audioStatus.queueLength = 0;
      this.notifyListeners('audioStatusChange', { ...this.audioStatus });
    }
  }

  startHeartbeatMonitor() {
    if (this.heartbeatIntervalId) clearInterval(this.heartbeatIntervalId);
    this.heartbeatIntervalId = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      } else if (!this.isConnected && !this.connecting) {
        this.attemptReconnect();
      }
    }, this.heartbeatInterval);
  }

  notifyListeners(type, data) {
    if (this.listeners[type]) {
      this.listeners[type].forEach((callback) => {
        try {
          callback(data);
        } catch (e) {}
      });
    }
  }
}

const WebSocketServiceInstance = new WebSocketService();
export default WebSocketServiceInstance;
