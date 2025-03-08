import Cookies from 'js-cookie';

// دالة لحذف جميع الكوكيز
export const deleteAllCookies = () => {
  // الحصول على جميع الكوكيز
  const cookies = Cookies.get();

  // حذف كل كوكي واحدًا تلو الآخر
  Object.keys(cookies).forEach(cookieName => {
    Cookies.remove(cookieName);
  });

  console.log('تم حذف جميع الكوكيز بنجاح.');
};

// استخدام الدالة