export const API_ROUTES = {
    LOGINADMIN:'admin/login',
    LOGINUSER:'residential/login',
    ADD_MEMBERS:'admin/residential',
    UPLOAD_PAYMENT:'payment/upload',
    PAYMENT_HISTORY: '/payment/history',
    RESIDENTIAL_PAYMENTS:'admin/residential/payments',
    VERIFY_PAYMENT: (id) => `/payment/admin/${id}/verify`,
    PROFILE_GET:'residential/profile',
    MY_NOTIFICATION:'notifications',
    ADMIN_PROFILE:'admin/profile',
    ADMIN_NOTIFICATION:'events/notification/admin'
}