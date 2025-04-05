import axios from "axios";
import Cookies from "js-cookie";
const baseApi = import.meta.env.VITE_REACT_APP_API_URL;

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(
            `${baseApi}/auth/login`,
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
      // استخدام مكتبة js-cookie لاسترجاع التوكن من الكوكيز
      const token = Cookies.get('token');
      const response = await axios.post(
        `${baseApi}/auth/verify`,
        {},
        {
          withCredentials: true, // إرسال الكوكيز مع الطلب
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      return response;
    } catch (error) {
      const err = error as any;
      console.error("Error verifying token:", err.response?.data || err.message);
      throw error;
    }
  };

export const deleteUserById = async (id: string) => {
    try {
        const response = await axios.delete(
            `${baseApi}/auth/user/delete/${id}`,
            { withCredentials: true } // إرسال الكوكيز مع الطلب
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        return error;
    }
};

export const userEdit = async (id: string, data: any) => {
    try {
        const response = await axios.put(
            `${baseApi}/auth/user/edit/${id}`,
            data,
            { withCredentials: true } // إرسال الكوكيز مع الطلب
        );
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
                withCredentials: true // إرسال الكوكيز مع الطلب
            }
        );
        return response;
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

export const createUser = async (data: { username: string, password: string, role: string }) => {
    try {
        const response = await axios.post(
            `${baseApi}/auth/register`,
            data,
            { withCredentials: true } // إرسال الكوكيز مع الطلب
        );
        return response;
    } catch (error) {
        console.log("Error creating user:", error);
        return error;
    }
};

export const deleteBackup = async (id: string) => {
    try {
        const response = await axios.delete(
            `${baseApi}/auth/backup/delete/${id}`,
            { withCredentials: true } // إرسال الكوكيز مع الطلب
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting backup:", error);
    }
};

export const restoreBackup = async (id: string) => {
    try {
        const response = await axios.post(
            `${baseApi}/auth/backup/restore/${id}`,
            {},
            { withCredentials: true } // إرسال الكوكيز مع الطلب
        );
        return response.data;
    } catch (error) {
        console.error("Error restoring backup:", error);
        return error;
    }
};

export const verifyToken2FA = async (token: string, uuid: string) => {
    try {
        const response = await axios.post(
            `${baseApi}/auth/user/verify/2fa`,
            { token, uuid },
            {
                withCredentials: true // إرسال الكوكيز مع الطلب
            }
        );
        return response;
    } catch (error) {
        console.error("Error verifying token:", error);
        return error;
    }
};

export const getDataUsers = async (role:string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/get/all/username/${role}`);
        const data = response.data.usernames || []
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};