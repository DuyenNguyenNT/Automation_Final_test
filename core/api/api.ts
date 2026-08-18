import { APIRequestContext } from '@playwright/test';
import { ENV } from '../../env/env';

export class APIHelper {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }



    /**
     * Get current user profile
     */
    async getProfile(token: string) {
        const response = await this.request.get(`${ENV.BASE_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    /**
     * Update profile name via PATCH /api/profile
     */
    async updateProfile(name: string, token: string) {
        const response = await this.request.patch(`${ENV.BASE_URL}/api/profile`, {
            data: { name },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }



    /**
     * Update (overwrite) cart
     */
    async updateCart(items: any[], token: string) {
        const response = await this.request.put(`${ENV.BASE_URL}/api/cart`, {
            data: { items },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    // Clear cart
    async clearCart(token: string) {
        const response = await this.request.post(`${ENV.BASE_URL}/api/cart/clear`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status();
    }

    // Delete all orders for current user

    async deleteAllOrders(token: string) {
        const response = await this.request.delete(`${ENV.BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status();
    }
}
