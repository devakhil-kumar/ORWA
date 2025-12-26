import { addMemberAPI, AnnouncementsHistroy, ContactUs, ContactUsUser, createEventAdmin, DeleteAdminEvent, fetchResidentialPayments, getAdminNotification, getAdminProfile, getEventAdmin, getMemberList, getProfile, getresidentailsAdmin, getSocietyAdmin, loginAPIAdmin, loginAPIUser, memberVerifyPayment, PaymentHistory, PaymentUpload, UpdateEventAdmin, updateSocietyAdmin, verifyPayment } from "./api";

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
            error || "Failed to update profile"
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

export const AnnouncementsUserService = async () => {
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

export const announcementAdminService = async (isActive, page, limit) => {
    try {
        const response = await getEventAdmin(isActive, page, limit);
        console.log(response, 'res')
        return response;
    } catch (error) {
        console.log(error, 'error')
        return Promise.reject(error);
    }
};

export const addEventService = async (userData) => {
    try {
        const response = await createEventAdmin(userData);
        console.log(response, 'res')
        return response;
    } catch (error) {
        console.log(error, 'error')
        return Promise.reject(error);
    }
};

export const adminEventUpdateService = async (id, payload) => {
    try {
        const response = await UpdateEventAdmin(id, payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update payment status' };
    }
};

export const getAdminResdidentailsService = async () => {
    try {
        const response = await getresidentailsAdmin();
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch profile.');
    }
};

export const adminEventDeleteService = async (id) => {
    try {
        const response = await DeleteAdminEvent(id);
        console.log(response, 'response++++++++++++++=')
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update payment status' };
    }
};

export const AdminMemeberRequestsService = async () => {
    try {
        const response = await getMemberList();
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch profile.');
    }
};

export const verifyMemberService = async (Id, status) => {
    try {
        const response = await memberVerifyPayment(Id, status);
        console.log(response, 'response++++++++++++++=')
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update payment status' };
    }
};

export const societyAdminService = async (page, limit) => {
    try {
        const response = await getSocietyAdmin(page, limit);
        console.log(response, 'res')
        return response;
    } catch (error) {
        console.log(error, 'error')
        return Promise.reject(error);
    }
};

export const societyUpdateService = async (id, payload) => {
    try {
        const response = await updateSocietyAdmin(id, payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update payment status' };
    }
};

export const ContactusService = async (message) => {
    try {
        const response = await ContactUs(message);
        return response.data
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update payment status' };
    }
}

export const UserContactUsSerivce = async (payload) => {
    try {
        const response = await ContactUsUser(payload);
        console.log(response, 'response++++')
        return response.data
    } catch (error) {
        console.log(error.response?.data, 'error')
        throw error.response?.data || { message: 'Failed to update payment status' };
    }
}