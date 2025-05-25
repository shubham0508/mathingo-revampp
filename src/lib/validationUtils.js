export const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email address.';
  return null;
};

export const validatePassword = (password, fieldName = 'Password') => {
  if (!password) return `${fieldName} is required.`;
  if (password.length < 6)
    return `${fieldName} must be at least 6 characters long.`;
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required.';
  return null;
};

export const validateOtp = (otp) => {
  if (!otp) return 'OTP is required.';
  if (otp.length !== 6 || !/^\d+$/.test(otp))
    return 'Please enter a valid 6-digit OTP.';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirm Password is required.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
};
