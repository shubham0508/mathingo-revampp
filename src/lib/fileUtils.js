import { FILE_TYPES, MAX_FILE_SIZE } from "@/config/constant";

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
