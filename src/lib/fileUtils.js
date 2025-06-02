import { FILE_TYPES, MAX_FILE_SIZE } from '@/config/constant';

export const validateFile = (file) => {
  const errors = {};
  if (!FILE_TYPES.ALL.includes(file.type)) {
    errors.typeError = `Invalid file type: ${file.type}. Allowed types: images and PDFs.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    errors.sizeError = `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size: 5MB`;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const createFileData = (file) => {
  const isImage = FILE_TYPES.IMAGE.includes(file.type);
  return {
    id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    file,
    name: file.name,
    type: file.type,
    preview: isImage ? URL.createObjectURL(file) : null,
    isImage,
    isPdf: file.type === 'application/pdf',
    size: file.size,
  };
};

export const dataURLtoFile = (dataurl, filename) => {
  if (!dataurl) return null;
  const arr = dataurl.split(',');
  if (arr.length < 2) return null;
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || mimeMatch.length < 2) return null;
  const mime = mimeMatch[1];
  let bstr;
  try {
    bstr = atob(arr[1]);
  } catch (e) {
    console.error('Error decoding base64 string', e);
    return null;
  }
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
