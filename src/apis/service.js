import { addMemberAPI, AnnouncementsHistroy, fetchResidentialPayments, getAdminNotification, getAdminProfile, getProfile, loginAPIAdmin, loginAPIUser, PaymentHistory, PaymentUpload, verifyPayment } from "./api";

export const loginService = async userData => {
    try {
        const response = await loginAPIUser(userData);
        console.log(response, 'res')
        return response;
    } catch (error) {
        // const errorMessage =
        // error.response?.data?.message ||
        // error.response?.data?.error;
        return Promise.reject(error);
    }
};

export const loginServiceAdmin = async userData => {
    try {
        const response = await loginAPIAdmin(userData);
        console.log(response, 'res')
        return response;
    } catch (error) {
        console.log(error, 'error')
        // const errorMessage =
        //     error.response?.data?.message ||
        //     error.response?.data?.error;
        return Promise.reject(error);
    }
};

export const apiAddmemberService = async (formdata) => {
    try {
        const response = await addMemberAPI(formdata);
        console.log(response, 'data++++++++')
        return response
    } catch (error) {
        console.log(error, 'errorr++++++')
        throw new Error(
            error?.response?.data?.message || "Failed to update profile"
        );
    }
}

export const UploadPaymentService = async userData => {
    try {
        const response = await PaymentUpload(userData);
        console.log(response, 'res')
        return response;
    } catch (error) {
        console.log(error, 'error')
        // const errorMessage =
        //     error.response?.data?.message ||
        //     error.response?.data?.error;
        return Promise.reject(error);
    }
};

export const PaymentHistoryService = async (year, page, limit) => {
    try {
        const response = await PaymentHistory(year, page, limit);
        console.log(response, 'res')
        return response;
    } catch (error) {
        console.log(error, 'error')
        return Promise.reject(error);
    }
};

export const fetchResidentialPaymentsService = async (type = 'all') => {
    try {
        const response = await fetchResidentialPayments(type);
        console.log('Payments Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Payments Error:', error);
        throw error.response?.data || { message: 'Failed to fetch payments' };
    }
}

export const verifyPaymentService = async (paymentId, status) => {
    try {
        const response = await verifyPayment(paymentId, status);
        console.log(response, 'response++++++++++++++=')
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update payment status' };
    }
};

export const getProfileService = async () => {
    try {
        const response = await getProfile();
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch profile.');
    }
};

export const AnnouncementsUserService = async() => {
    try {
        const response = await AnnouncementsHistroy();
        console.log(response, 'res')
        return response.data;
    } catch (error) {
        console.log(error, 'error')
        return Promise.reject(error);
    }
};

export const getAdminProfileService = async () => {
    try {
        const response = await getAdminProfile();
        console.log(response.data, 'data=++++++++')
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch profile.');
    }
};

export const notificationAdminService = async (page, limit) => {
    try {
        const response = await getAdminNotification(page, limit);
        console.log(response, 'res')
        return response;
    } catch (error) {
        console.log(error, 'error')
        return Promise.reject(error);
    }
};