import axios from "axios";
import { API_ROUTES } from "./constant";
import { getUserData } from "../units/asyncStorageManager";
import { withDelay } from "react-native-reanimated";

// const BASE_URL = "http://49.13.70.253:5010/api/";
const BASE_URL = "http://49.13.70.253:2424/api/";
// const BASE_URL = "https://6771-2405-201-5020-c0a7-1019-7d94-7608-c95.ngrok-free.app/api/";



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

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const method = error?.config?.method?.toUpperCase();
        const requestUrl = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
        console.log('API ERROR =>', {
            method,
            url: requestUrl,
            status: error?.response?.status,
            message: error?.response?.data?.message || error?.message,
        });
        return Promise.reject(error);
    }
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

    // Debug: log all FormData fields
    console.log('FormData parts:', formData._parts);
    formData._parts.forEach(([key, value]) => {
        console.log(`  ${key}:`, value);
    });

    const response = await fetch(`${BASE_URL}${API_ROUTES.ADD_MEMBERS}`, {
        method: 'POST',
        headers: {
            'x-request-source': 'mobile',
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    console.log('Response dfxfcg:', response);


    if (!response.ok) {
        // Log the actual error response body from server
        const errorBody = await response.json();
        console.log('Error response body:', errorBody?.message);
        throw new Error(errorBody?.message);
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
            'Content-Type': 'multipart/form-data',
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

export const TerminateMemberAPI = async (id) => {
    console.log("ID : from api", id)
    return axiosInstance.get(API_ROUTES.TERMINATE_MEMBER(id));
}

export const ReActivateMemberAPI = async (id) => {
    console.log("ID : from api", id)
    return axiosInstance.get(API_ROUTES.REACTIVATE_MEMBER(id));
}


export const PaymentUpload = async (userData, isAdmin = false) => {
    const { token } = await getUserData();
    console.log(`IsAdmin : ${isAdmin}`);
    const url = isAdmin ? `${BASE_URL}${API_ROUTES.ADMIN_UPLOAD_PAYMENT}` : `${BASE_URL}${API_ROUTES.UPLOAD_PAYMENT}`;
    console.log(`Url : ${url}`)
    return axios.post(url, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const PaymentEditUpload = async (paymentData, paymentId) => {
    const { token } = await getUserData();
    console.log("Payment ID : ", paymentId);
    console.log("token: ", token);
    console.log(`Url : ${BASE_URL}${API_ROUTES.ADMIN_EDIT_PAYMENT(paymentId)}`);
    console.log('FormData parts:', JSON.stringify(paymentData));

    const response = await fetch(`${BASE_URL}${API_ROUTES.ADMIN_EDIT_PAYMENT(paymentId)}`, {
        method: 'PUT',
        headers: {
            'x-request-source': 'mobile',
            Authorization: `Bearer ${token}`,
        },
        body: paymentData,
    });

    const data = await response.json();
    console.log("Response from api.js:", data);

    if (!response.ok) {
        console.log("Error from api.js", data);
        throw new Error(data?.message || 'Payment edit upload failed');
    }

    return { data };
};

export const PaymentHistory = (page = 1, limit = 20) => {
    return axiosInstance.get(API_ROUTES.PAYMENT_HISTORY, {
        params: { page, limit },
    });
};

export const fetchResidentialPayments = (type = 'all', page = 1, limit = 10) => {
    return axiosInstance.get(API_ROUTES.RESIDENTIAL_PAYMENTS, {
        params: {
            type,
            page,
            limit,
        },
    });
};

export const fetchResidentialFromIdPayments = (userId, page = 1, limit = 10) => {
    return axiosInstance.get(API_ROUTES.RESIDENTIAL_PAYMENTS_FROM_ID(userId), {
        params: {
            page,
            limit,
        },
    });
};


export const verifyPayment = (paymentId, status, paidFrom, paidTo) => {
    return axiosInstance.put(API_ROUTES.VERIFY_PAYMENT(paymentId), { status, paidFrom, paidTo });
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

export const updateUserProfile = async (updatedData, retryCount = 0) => {
    const { token } = await getUserData();

    try {
        const response = await axios.put(
            `${BASE_URL}${API_ROUTES.UPDATE_USER_PROFILE}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-request-source': 'mobile',
                    Accept: 'application/json',
                },
                timeout: 120000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                onUploadProgress: (e) => {
                    if (e.total) {
                        console.log('Upload progress:', e.loaded, '/', e.total);
                    }
                },
                transformRequest: (data, headers) => {
                    if (data instanceof FormData && headers) {
                        if (typeof headers.delete === 'function') {
                            headers.delete('Content-Type');
                        } else {
                            delete headers['Content-Type'];
                        }
                    }
                    return data;
                },
            }
        );

        return response;
    } catch (error) {
        const isNetworkError =
            error?.message === 'Network Error' || error?.code === 'ERR_NETWORK';

        if (isNetworkError && retryCount < 1) {
            console.log('Network error after upload, retrying once...');
            await new Promise((r) => setTimeout(r, 1000));
            return updateUserProfile(updatedData, retryCount + 1);
        }

        console.log('Update profile failed:', {
            message: error?.message,
            code: error?.code,
            status: error?.response?.status,
            data: error?.response?.data,
        });

        throw error;
    }
};


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

export const getTerminationRequests = () => {
    return axiosInstance.get(API_ROUTES.GET_TERMINATION_REQUESTS)
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

export const ContactUsUser = async (formData) => {
    console.log("jhgjhgjhvjhvjhvjhvjghvjhg", formData);
    const { token } = await getUserData();
    return axios.post(`${BASE_URL}${API_ROUTES.USERCONTACT_US}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    // return axiosInstance.post(API_ROUTES.USERCONTACT_US, fromData)
}

export const deleteResidential = () => {
    return axiosInstance.post(`${API_ROUTES.DELETE_ACOUNT}`)
}

export const UsersContactUsListApi = (status, page, limit) => {
    return axiosInstance.get(
        `${API_ROUTES.GET_COMPLAINTS}?status=${status}&page=${page}&limit=${limit}`
    );
};

export const ChangePasswordAdmin = (userData) => {
    return axiosInstance.put(API_ROUTES.CHANGE_PASSWORD_ADMIN, userData)
}

export const ChangePasswordResedential = (userData) => {
    return axiosInstance.put(API_ROUTES.CHANGE_PASSWORD_RESEDENTIAL, userData)
}


