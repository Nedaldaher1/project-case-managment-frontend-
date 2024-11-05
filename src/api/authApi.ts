import axios from "axios";

const baseApi =import.meta.env.VITE_REACT_APP_API_URL;


export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${baseApi}/auth/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const fetchVerifyToken = async (token: string) => {
    try {
        
        const response = await axios.post(
            `${baseApi}/auth/verify`,
            { token },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        const err = error as any;
        console.error("Error verifying token:", err.response?.data || err.message);
        throw error; // رمي الخطأ لكي يمكن التقاطه في onError
    }
}


