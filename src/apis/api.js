import axios from "axios";
import { API_ROUTES } from "./constant";
import { getUserData } from "../units/asyncStorageManager";

const BASE_URL = "http://77.42.18.162:5001/api/";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const { token } = await getUserData();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.log(err, 'erorr')
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const loginAPIUser = userData => {
    return axiosInstance.post(API_ROUTES.LOGINUSER, userData);
}

export const loginAPIAdmin = userData => {
    return axiosInstance.post(API_ROUTES.LOGINADMIN, userData);
}

export const addMemberAPI = async (formData) => {
    const { token } = await getUserData();
    console.log('API URL:', `${BASE_URL}${API_ROUTES.ADD_MEMBERS}`);
    return axios.post(`${BASE_URL}${API_ROUTES.ADD_MEMBERS}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-request-source': 'mobile',
            Authorization: `Bearer ${token}`,
        },
    });
};

export const PaymentUpload = async (userData) => {
    const { token } = await getUserData();
    return axios.post(`${BASE_URL}${API_ROUTES.UPLOAD_PAYMENT}`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const PaymentHistory = (year, page, limit) => {
    return axiosInstance.get(`${API_ROUTES.PAYMENT_HISTORY}?year=${year}&page=${page}&limit=${limit}`);
}


export const fetchResidentialPayments = (type = 'all') => {
    return axiosInstance.get(`${API_ROUTES.RESIDENTIAL_PAYMENTS}?type=${type}`);
};


export const verifyPayment = (paymentId, status) => {
    return axiosInstance.put(API_ROUTES.VERIFY_PAYMENT(paymentId), { status });
};


export const getProfile = () => {
    return axiosInstance.get(API_ROUTES.PROFILE_GET)
}

export const AnnouncementsHistroy = () => {
    console.log(API_ROUTES.MY_NOTIFICATION, 'clshbckhsgfdvdkfvbdkbvjdf')
    return axiosInstance.get(API_ROUTES.MY_NOTIFICATION);
}

export const getAdminProfile = () => {
    return axiosInstance.get(API_ROUTES.ADMIN_PROFILE)
}

export const getAdminNotification = (page, limit) => {
    return axiosInstance.get(`${API_ROUTES.ADMIN_NOTIFICATION}?page=${page}&limit=${limit}`)
}