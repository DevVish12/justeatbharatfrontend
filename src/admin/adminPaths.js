const normalizePathSegment = (rawPath, fallback) => {
    const value = String(rawPath || fallback)
        .trim()
        .replace(/^\/+|\/+$/g, "");

    if (!value) {
        return fallback;
    }

    return value.startsWith("admin/") ? value.slice(6) : value;
};

export const adminRoutePaths = {
    register: normalizePathSegment(
        import.meta.env.VITE_ADMIN_REGISTER_PATH,
        "secure-portal-r9k-register"
    ),
    login: normalizePathSegment(
        import.meta.env.VITE_ADMIN_LOGIN_PATH,
        "secure-portal-r9k-login"
    ),
    dashboard: normalizePathSegment(
        import.meta.env.VITE_ADMIN_DASHBOARD_PATH,
        "secure-portal-r9k-dashboard"
    ),
    forgotPassword: normalizePathSegment(
        import.meta.env.VITE_ADMIN_FORGOT_PATH,
        "secure-portal-r9k-forgot"
    ),
    resetPassword: normalizePathSegment(
        import.meta.env.VITE_ADMIN_RESET_PATH,
        "secure-portal-r9k-reset"
    ),
    heroManage: normalizePathSegment(
        import.meta.env.VITE_ADMIN_HERO_PATH,
        "secure-portal-r9k-hero-manage"
    ),
    categories: normalizePathSegment(
        import.meta.env.VITE_ADMIN_CATEGORIES_PATH,
        "secure-portal-r9k-categories"
    ),
    menuItems: normalizePathSegment(
        import.meta.env.VITE_ADMIN_MENU_ITEMS_PATH,
        "secure-portal-r9k-menu-items"
    ),
    addons: normalizePathSegment(
        import.meta.env.VITE_ADMIN_ADDONS_PATH,
        "secure-portal-r9k-addons"
    ),
    orders: normalizePathSegment(
        import.meta.env.VITE_ADMIN_ORDERS_PATH,
        "secure-portal-r9k-orders"
    ),
    contacts: normalizePathSegment(
        import.meta.env.VITE_ADMIN_CONTACTS_PATH,
        "secure-portal-r9k-contacts"
    ),
    jobInfo: normalizePathSegment(
        import.meta.env.VITE_ADMIN_JOB_INFO_PATH,
        "secure-portal-r9k-job-info"
    ),
    tables: normalizePathSegment(
        import.meta.env.VITE_ADMIN_TABLES_PATH,
        "secure-portal-r9k-tables"
    ),
    coupons: normalizePathSegment(
        import.meta.env.VITE_ADMIN_COUPONS_PATH,
        "secure-portal-r9k-coupons"
    ),
    dishImages: normalizePathSegment(
        import.meta.env.VITE_ADMIN_DISH_IMAGES_PATH,
        "secure-portal-r9k-dish-images"
    ),
    storeSettings: normalizePathSegment(
        import.meta.env.VITE_ADMIN_STORE_SETTINGS_PATH,
        "secure-portal-r9k-store-settings"
    ),
};

export const getAdminUrl = (key) => `/admin/${adminRoutePaths[key]}`;
