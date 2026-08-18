const BASE_URL = process.env.BASE_URL || 'https://testing.platformforge.dev';

export const ENV = {
    BASE_URL: BASE_URL,
    LOGIN_URL: process.env.LOGIN_URL || `${BASE_URL}/login`,
    HOME_URL: process.env.HOME_URL || `${BASE_URL}/home`,
    CART_URL: process.env.CART_URL || `${BASE_URL}/cart`,
    CHECKOUT_URL: process.env.CHECKOUT_URL || `${BASE_URL}/checkout`,
    PROFILE_URL: process.env.PROFILE_URL || `${BASE_URL}/profile`
};
