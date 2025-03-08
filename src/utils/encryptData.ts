import CryptoJS from 'crypto-js';

// مفتاح سري للتشفير (يجب أن يكون هذا المفتاح آمنًا ولا يتم مشاركته)
const SECRET_KEY = `${import.meta.env.VITE_REACT_APP_PRIVATE_KEY}`; // استبدل هذا بمفتاح سري قوي

// تشفير البيانات
export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// فك تشفير البيانات
export const decryptData = (ciphertext: string): any => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};