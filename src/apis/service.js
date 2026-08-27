import { terminationRequest } from "../app/features/getprofileSlice";
import {
    addMemberAPI, updateMemberAPI, AnnouncementsHistroy, ContactUs,
    ContactUsUser, createEventAdmin, DeleteAdminEvent, fetchResidentialPayments,
    getAdminNotification, getAdminProfile, getEventAdmin, getMemberList, getProfile,
    getresidentailByIdAdmin, getresidentailsAdmin, getSocietyAdmin, loginAPIAdmin,
    loginAPIUser, memberVerifyPayment, PaymentHistory, PaymentUpload, UpdateEventAdmin,
    updateSocietyAdmin, verifyPayment, TerminateMemberAPI, resetPasswordAPI, verifyOtpAPI,
    forgotPasswordAPI, updateUserProfile, fetchResidentialFromIdPayments,
    getTerminationRequests, TerminationRequest,
    terminateResidential, PaymentEditUpload, ReActivateMemberAPI, UsersContactUsListApi,
    ChangePasswordAdmin,
    ChangePasswordResedential
} from "./api";

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
        console.log(response, 'res from admin')
        return response;
    } catch (error) {
        console.log(error, 'error from admin login')
        // const errorMessage =
        //     error.response?.data?.message ||
        //     error.response?.data?.error;
        return Promise.reject(error);
    }
};

export const forgotPasswordService = async userData => {
    try {
        const response = await forgotPasswordAPI(userData);
        console.log(response, 'res')
        return response;
    } catch (error) {
        // const errorMessage =
        // error.response?.data?.message ||
        // error.response?.data?.error;
        console.log(error, 'error+++++')

        return Promise.reject(error);
    }
};

export const verifyOtpService = async userData => {
    try {
        const response = await verifyOtpAPI(userData);
        console.log(response, 'res')
        return response;
    } catch (error) {
        // const errorMessage =
        // error.response?.data?.message ||
        // error.response?.data?.error;
        return Promise.reject(error);
    }
};

export const resetPasswordService = async userData => {
    try {
        const response = await resetPasswordAPI(userData);
        console.log(response, 'res')
        return response;
    } catch (error) {
        // const errorMessage =
        // error.response?.data?.message ||
        // error.response?.data?.error;
        return Promise.reject(error);
    }
};

// export const apiAddmemberService = async (formdata) => {
//     try {
//         console.log(formdata, 'formdata from service')
//         const response = await addMemberAPI(formdata);
//         console.log(response, 'data++++++++')
//         return response
//     } catch (error) {
//         console.log(error, 'errorr++++++')
//         throw new Error(
//             error || "Failed to add profile"
//         );
//     }
// }

export const apiAddmemberService = async (formdata) => {
    try {
        const response = await addMemberAPI(formdata);

        return response;
    } catch (error) {
        console.log(error.message)
        throw error.message || "Failed to add profile";
    }
}

export const apiUpdatememberService = async (formdata, id) => {
    try {
        console.log("id from service: ", id);
        const response = await updateMemberAPI(formdata, id);
        console.log(response, 'data++++++++')
        return response
    } catch (error) {
        console.log(error, 'errorr++++++')
        throw new Error(
            error || "Failed to update profile"
        );
    }
}
export const apiTerminateMemberService = async (id) => {
    try {
        console.log("id from services:", id);
        const response = await TerminateMemberAPI(id);
        console.log('Delete member', response)
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message
                || error.message
                || 'Failed to delete member.',
            status: error.response?.status || 500,
        };
    }
};

export const apiReActivateMemberService = async (id) => {
    try {
        console.log("id from services:", id);
        const response = await ReActivateMemberAPI(id);
        console.log('Re-Activate member', response)
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message
                || error.message
                || 'Failed to Re-Activate member.',
            status: error.response?.status || 500,
        };
    }
};

export const UploadPaymentService = async (userData, isAdmin) => {
    try {
        const response = await PaymentUpload(userData, isAdmin);
        console.log(response, 'response from service upload payment.')
        return response;
    } catch (error) {
        console.log('Status response:', error.response);
        console.log(error, 'error from service upload payment.')
        // const errorMessage =
        //     error.response?.data?.message ||
        //     error.response?.data?.error;
        return Promise.reject(error);
    }
};

export const EditPaymentService = async (paymentData, paymentId) => {
    try {
        console.log("Payment ID : ", paymentId);
        const response = await PaymentEditUpload(paymentData, paymentId);
        console.log(response.data, 'response from service edit payment.');
        return response;
    } catch (error) {
        console.log('Error:', error?.response?.data || error.message);
        return Promise.reject(error);
    }
};

export const PaymentHistoryService = async (page = 1, limit = 20) => {
    try {
        const response = await PaymentHistory(page, limit);
        console.log(response, 'res');
        return response;
    } catch (error) {
        console.log(error, 'error');
        return Promise.reject(error);
    }
};

export const fetchResidentialPaymentsService = async (
    type = 'all',
    page = 1,
    limit = 10
) => {
    try {
        const response = await fetchResidentialPayments(type, page, limit);
        console.log('Payments Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Payments Error:', error);
        throw error.response?.data || { message: 'Failed to fetch payments' };
    }
};

export const fetchResidentialPaymentsFromIdService = async (
    userId,
    page = 1,
    limit = 10
) => {
    try {
        const response = await fetchResidentialFromIdPayments(userId, page, limit);
        console.log('Payments Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Payments Error:', error);
        throw error.response?.data || { message: 'Failed to fetch payments' };
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

export const updateUserProfileService = async (updatedData) => {
    try {
        console.log('Updated profile data from slice :', updatedData);
        const response = await updateUserProfile(updatedData);
        console.log('API response for profile update:', response);
        return response.data;
    } catch (error) {
        const serverMessage = error?.response?.data?.message;
        console.log('Failed to update profile. Status:', error?.response?.status);
        console.log('Failed to update profile. Server data:', error?.response?.data);
        console.log('Failed to update profile. Raw error:', error.message);
        throw new Error(serverMessage || error.message || 'Failed to update profile.');
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

export const getTerminationRequestService = async () => {
    try {
        const response = await getTerminationRequests();
        console.log('termination request data :', response);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch profile.');
    }
};

// export const getAdminResdidentailByIdService = async (id) => {
//     try {
//         const response = await getresidentailByIdAdmin(id);
//         return response.data;
//     } catch (error) {
//         console.log(error);
//         throw new Error('Failed to fetch residential data by id.');
//     }
// };

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
        throw error.response?.data || { message: 'Failed to Send Your complaint.' };
    }
}

export const UserContactUsSerivce = async (formData) => {
    try {
        const response = await ContactUsUser(formData);
        console.log(response, 'response++++')
        return response.data
    } catch (error) {
        console.log(error, 'error hgvhjkj')
        throw error || { message: 'Failed to Send Your complaint.' };
    }
}

export const usersContactUsListSerivce = async (status, page, limit) => {
    try {
        const response = await UsersContactUsListApi(status, page, limit);
        console.log(response, 'response++++');
        return response.data;
    } catch (error) {
        console.log(error, 'error hgvhjkj');
        throw error || { message: 'Failed to get users complaint.' };
    }
};

export const chnageAdminPasswordService = async (userData) => {
    try {
        const response = await ChangePasswordAdmin(userData);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const chnageResedentialPasswordService = async (userData) => {
    try {
        const response = await ChangePasswordResedential(userData);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};



export const verifyPaymentService = async (paymentId, status, paidFrom, paidTo) => {
    const response = await verifyPayment(paymentId, status, paidFrom, paidTo);
    return response.data; 
};