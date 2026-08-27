import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from '../app/features/authSlice';
import messageReducer from '../app/features/messageSlice';
import AddMemeberSlice from '../app/features/addMemberSlice';
import paymentUploadSlice from '../app/features/paymentUploadSlice';
import paymentHistorySlice from '../app/features/paymentHistorySlice';
import residentialPaymentsSlice from '../app/features/residentialPaymentsSlice';
import paymentVerifySlice from '../app/features/paymentVerifySlice';
import getprofileReducer from '../app/features/getprofileSlice';
import announcementSliceUser from '../app/features/announcementSliceUser';
import adminNotificationReducer from '../app/features/adminNotificationSlice';
import eventAdminSliceReducer from '../app/features/eventAdminSlice';
import adminResidentialSlice from '../app/features/getResidentails';
import adminMemberRequestsSlice from '../app/features/adminMemberRequestsSlice';
import societyReducer from '../app/features/societySlice';
import contactSlice from '../app/features/contactSlice';
import userContactSerivce from '../app/features/userContactSlice';
import DeleteAcountReducer from '../app/features/deleteAcountSlice';
import { showMessage } from "../app/features/messageSlice";

const authMiddleware = storeAPI => next => action => {
    if (action?.payload?.status === 401) {
        storeAPI.dispatch(showMessage({
            type: 'error',
            text: 'You have been LoggedOut, Please login again.',
        }))
        storeAPI.dispatch(logout());
    }
    return next(action);
};

const store = configureStore({
    reducer: {
        auth: authReducer,
        message: messageReducer,
        addmember: AddMemeberSlice,
        payment: paymentUploadSlice,
        paymentHistory: paymentHistorySlice,
        residentialpayment: residentialPaymentsSlice,
        paymentApprove: paymentVerifySlice,
        profile: getprofileReducer,
        userAnnouncement: announcementSliceUser,
        adminNotification: adminNotificationReducer,
        eventAdmin: eventAdminSliceReducer,
        residential: adminResidentialSlice,
        memberList: adminMemberRequestsSlice,
        society: societyReducer,
        contact: contactSlice,
        contactUser: userContactSerivce,
        deleteAcount: DeleteAcountReducer
    },
    middleware: (getDefaultMiddleware) =>      
        getDefaultMiddleware().concat(authMiddleware),
})

export default store;