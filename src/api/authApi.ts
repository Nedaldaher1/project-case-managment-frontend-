import axios from "axios";
import {DialogEditUserProps} from '@/types/DialogEditUserProps'
const baseApi =import.meta.env.VITE_REACT_APP_API_URL;


export const loginUser = async (username: string, password: string) => {
    try {
        // التأكد من إرسال الكوكيز مع الطلب
        const response = await axios.post(`${baseApi}/auth/login`, 
            { username, password },
            {
                withCredentials: true // إرسال الكوكيز مع الطلب
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchVerifyToken = async () => {
    try {
        const response = await axios.post(
            `${baseApi}/auth/verify`,
            {},
            {
                withCredentials: true, // تفعيل إرسال ملفات تعريف الارتباط مع الطلب
            }
        );
        return response;
        
    } catch (error) {
        const err = error as any;
        console.error("Error verifying token:", err.response?.data || err.message);
        throw error; // رمي الخطأ لكي يمكن التقاطه في onError
    }
};

export const deleteUserById = async (id: string) => {
    try {
        const response = await axios.delete(`${baseApi}/auth/user/delete/${id}`);
        return response.data
        
    } catch (error) {
        console.error("Error deleting user:", error);
        return error;
    }
}

export const userEdit = async (id: string, data: any) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/user/edit/${id}`, data);
        return response;
    } catch (error) {
        console.error("Error editing user:", error);
        throw error;
    }
};

export const logoutSession = async () => {
    try {
        const response = await axios.post(
            `${baseApi}/auth/logout`,
            {},
            {
                withCredentials: true, // تفعيل إرسال ملفات تعريف الارتباط مع الطلب
            }
        );
        return response;
        
    } catch (error) {
        console.error("Error logging out:", error);
        
        
    }
}