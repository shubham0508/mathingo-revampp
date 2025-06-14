import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isMobileDevice = () => {
  return (
    typeof window !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  );
};

export const hasCameraAccess = async () => {
  try {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      return false;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
};

export const loadMathQuill = async (callback) => {
  if (typeof window === 'undefined') return;

  const jqueryScript = document.createElement('script');
  jqueryScript.src =
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
  jqueryScript.async = true;
  jqueryScript.crossOrigin = 'anonymous';
  document.body.appendChild(jqueryScript);

  jqueryScript.onload = () => {
    const mathquillScript = document.createElement('script');
    mathquillScript.src =
      'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js';
    mathquillScript.async = true;
    mathquillScript.crossOrigin = 'anonymous';
    document.body.appendChild(mathquillScript);

    const mathquillCSS = document.createElement('link');
    mathquillCSS.rel = 'stylesheet';
    mathquillCSS.href =
      'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css';
    document.head.appendChild(mathquillCSS);

    mathquillScript.onload = callback;
  };
};

export const getErrorMessage = (error) => {
  if (error?.data?.error && error.data.error[0]) {
    return error.data.error[0];
  }
  if (error?.message) {
    return error.message;
  }
  return 'Something went wrong! Please try again later.';
};

export const capitalizeName = (name) => {
  if (!name || typeof name !== 'string') return name;

  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
