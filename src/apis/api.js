import axios from "axios";
import { API_ROUTES } from "./constant";
import { getUserData } from "../units/asyncStorageManager";

const BASE_URL = "http://77.42.18.162:2424/api/";

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

export const forgotPasswordAPI = userData => {
    return axiosInstance.post(API_ROUTES.FORGOTPASSWORD, userData);
}

export const verifyOtpAPI = userData => {
    return axiosInstance.post(API_ROUTES.VERIFYOTP, userData);
}

export const resetPasswordAPI = userData => {
    return axiosInstance.post(API_ROUTES.RESETPASSWORD, userData);
}

// export const addMemberAPI = async (formData) => {
//     const { token } = await getUserData();
//     console.log('API URL:', `${BASE_URL}${API_ROUTES.ADD_MEMBERS}`);
//     return axios.post(`${BASE_URL}${API_ROUTES.ADD_MEMBERS}`, formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//             'x-request-source': 'mobile',
//             Authorization: `Bearer ${token}`,
//         },
//     });
// };

export const addMemberAPI = async (formData) => {
    const { token } = await getUserData();

    const response = await fetch(`${BASE_URL}${API_ROUTES.ADD_MEMBERS}`, {
        method: 'POST',
        headers: {
            'x-request-source': 'mobile',
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Add member API failed');
    }

    return response.json();
};

export const updateMemberAPI = async (formData, id) => {
    const { token } = await getUserData();
    console.log("ID : from api", id)
    console.log("token", token)
    const response = await fetch(`${BASE_URL}${API_ROUTES.UPDATE_MEMBER(id)}`, {
        method: 'PUT',
        headers: {
            'x-request-source': 'mobile',
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(response.body?.message || 'Update member API failed');
    }

    return response.json();
};

export const DeleteMemberAPI = async (id) => {
        console.log("ID : from api", id)
    return axiosInstance.delete(API_ROUTES.DELETE_MEMBER(id));
}

export const PaymentUpload = async (userData) => {
    const { token } = await getUserData();
    return axios.post(`${BASE_URL}${API_ROUTES.UPLOAD_PAYMENT}`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const PaymentHistory = (year, page, limit) => {
    return axiosInstance.get(`${API_ROUTES.PAYMENT_HISTORY}?year=${year}&page=${page}&limit=${limit}`);
}


export const fetchResidentialPayments = (type = 'all') => {
    return axiosInstance.get(`${API_ROUTES.RESIDENTIAL_PAYMENTS}?type=${type}&page=${1}&limit=${30}`);
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

export const getEventAdmin = (isActive, page, limit) => {
    return axiosInstance.get(`${API_ROUTES.GETALL_ANNOUNCEMENT}?isActive=${isActive}&page=${page}&limit=${limit}`)
}

export const createEventAdmin = async (formData) => {
    const { token } = await getUserData();
    return axios.post(`${BASE_URL}${API_ROUTES.ADD_EVENT}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const UpdateEventAdmin = async (id, payload) => {
    return axiosInstance.patch(API_ROUTES.UPDATE_EVENT(id), payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
}

export const getresidentailsAdmin = () => {
    return axiosInstance.get(API_ROUTES.GET_ALL_RESIDENTAILS)
}

// export const getresidentailByIdAdmin = (id) => {
//     return axiosInstance.get(API_ROUTES.GET_RESIDENTAIL(id))
// }

export const DeleteAdminEvent = async (id) => {
    return axiosInstance.delete(API_ROUTES.DELETE_EVENT(id));
}

export const getMemberList = () => {
    return axiosInstance.get(API_ROUTES.MEMBERLIST)
}

export const memberVerifyPayment = (Id, status) => {
    return axiosInstance.put(API_ROUTES.MEMEBERLIST_APPROVE(Id), { status });
};

export const getSocietyAdmin = (page, limit) => {
    return axiosInstance.get(`${API_ROUTES.SOCIETYGET}?page=${page}&limit=${limit}`)
}

export const updateSocietyAdmin = (id, payload) => {
    return axiosInstance.put(API_ROUTES.UPDATESOCIETY(id), payload)
}

export const ContactUs = (message) => {
    return axiosInstance.post(API_ROUTES.CONTACT_US, message)
}

export const ContactUsUser = async (formData) => {console.log("jhgjhgjhvjhvjhvjhvjghvjhg",formData);
    const { token } = await getUserData();
    return axios.post(`${BASE_URL}${API_ROUTES.USERCONTACT_US}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    // return axiosInstance.post(API_ROUTES.USERCONTACT_US, fromData)
}