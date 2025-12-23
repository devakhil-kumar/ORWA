import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../app/features/authSlice';
import messageReducer from '../app/features/messageSlice';
import AddMemeberSlice from '../app/features/addMemberSlice';
import paymentUploadSlice from '../app/features/paymentUploadSlice';
import paymentHistorySlice from '../app/features/paymentHistorySlice';
import residentialPaymentsSlice from '../app/features/residentialPaymentsSlice';
import paymentVerifySlice from '../app/features/paymentVerifySlice';
import getprofileReducer from '../app/features/getprofileSlice';
import announcementSliceUser from '../app/features/announcementSliceUser';
import adminNotificationReducer from '../app/features/adminNotificationSlice';

const store = configureStore({
    reducer: {
        auth:authReducer,
        message:messageReducer,
        addmember:AddMemeberSlice,
        payment:paymentUploadSlice,
        paymentHistory:paymentHistorySlice,
        residential:residentialPaymentsSlice,
        paymentApprove:paymentVerifySlice,
        profile:getprofileReducer,
        userAnnouncement:announcementSliceUser,
        adminNotification:adminNotificationReducer
    }
})

export default store;