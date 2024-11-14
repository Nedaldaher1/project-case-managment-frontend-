import qrcode from 'qrcode';
import axios from 'axios';

// دالة لإنشاء رمز الاستجابة الثنائية

export const getQRcode = async (id: string) => {
    try {
        // جلب بيانات المستخدم من الخادم
        const { data } = await axios.get(`/auth/user/qrcode/${id}`);
        // إنشاء رمز الاستجابة الثنائية
        const qrCode = await qrcode.toDataURL(data.otpauthUrl);
        return qrCode;
    } catch (error) {
        console.error(error);
        return;
    }
};