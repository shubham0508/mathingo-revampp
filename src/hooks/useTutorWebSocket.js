import WebSocketServiceInstance from '@/lib/WebSocketService'; // Adjust path as needed
import { useEffect, useState, useCallback, useRef } from 'react';

export const useTutorWebSocket = (callbacks) => {
  const { message, error, connectionChange, audioStatusChange, heartbeat } =
    callbacks || {};
  const [connected, setConnected] = useState(
    WebSocketServiceInstance.isConnected,
  );
  const [currentAudioStatus, setCurrentAudioStatus] = useState(() =>
    WebSocketServiceInstance.getAudioStatus(),
  );
  const serviceRef = useRef(WebSocketServiceInstance);

  useEffect(() => {
    const service = serviceRef.current;

    const handleMessage = (data) => message && message(data);
    const handleError = (err) => error && error(err);
    const handleConnectionChange = (isConnected) => {
      setConnected(isConnected);
      connectionChange && connectionChange(isConnected);
    };
    const handleAudioStatusChangeInternal = (status) => {
      setCurrentAudioStatus(status);
      audioStatusChange && audioStatusChange(status);
    };
    const handleHeartbeat = (data) => heartbeat && heartbeat(data);

    const unsubMessage = service.addListener('message', handleMessage);
    const unsubError = service.addListener('error', handleError);
    const unsubConnection = service.addListener(
      'connectionChange',
      handleConnectionChange,
    );
    const unsubAudioStatus = service.addListener(
      'audioStatusChange',
      handleAudioStatusChangeInternal,
    );
    const unsubHeartbeat = service.addListener('heartbeat', handleHeartbeat);

    setConnected(service.isConnected); // Sync connection status on mount/deps change
    setCurrentAudioStatus(service.getAudioStatus()); // Sync audio status on mount/deps change

    if (!service.isConnected && !service.connecting) {
      service.connect();
    }

    return () => {
      unsubMessage();
      unsubError();
      unsubConnection();
      unsubAudioStatus();
      unsubHeartbeat();
    };
  }, [message, error, connectionChange, audioStatusChange, heartbeat]);

  const sendMessage = useCallback(
    async (data) => {
      try {
        await serviceRef.current.sendMessage(data);
      } catch (e) {
        if (error) error(e);
        else console.error('useTutorWebSocket sendMessage error:', e);
        throw e;
      }
    },
    [error],
  );

  const pauseAudio = useCallback(async () => {
    try {
      return await serviceRef.current.pauseAudio();
    } catch (e) {
      if (error) error(e);
      else console.error('useTutorWebSocket pauseAudio error:', e);
      throw e;
    }
  }, [error]);
  const resumeAudio = useCallback(async () => {
    try {
      return await serviceRef.current.resumeAudio();
    } catch (e) {
      if (error) error(e);
      else console.error('useTutorWebSocket resumeAudio error:', e);
      throw e;
    }
  }, [error]);
  const stopAudio = useCallback(() => {
    try {
      return serviceRef.current.stopAudio();
    } catch (e) {
      if (error) error(e);
      else console.error('useTutorWebSocket stopAudio error:', e);
      throw e;
    }
  }, [error]);
  const toggleMute = useCallback(() => {
    try {
      return serviceRef.current.toggleMute();
    } catch (e) {
      if (error) error(e);
      else console.error('useTutorWebSocket toggleMute error:', e);
      throw e;
    }
  }, [error]);
  const completeStream = useCallback(() => {
    try {
      serviceRef.current.complete();
    } catch (e) {
      if (error) error(e);
      else console.error('useTutorWebSocket completeStream error:', e);
      throw e;
    }
  }, [error]);

  const connect = useCallback(() => {
    try {
      serviceRef.current.connect();
    } catch (e) {
      if (error) error(e);
      else console.error('useTutorWebSocket connect error:', e);
      throw e;
    }
  }, [error]);

  const disconnect = useCallback(() => {
    try {
      serviceRef.current.disconnect();
    } catch (e) {
      if (error) error(e);
      else console.error('useTutorWebSocket disconnect error:', e);
      throw e;
    }
  }, [error]);

  return {
    connected,
    sendMessage,
    pauseAudio,
    resumeAudio,
    stopAudio,
    toggleMute,
    completeStream,
    audioStatus: currentAudioStatus,
    connect,
    disconnect,
  };
};
