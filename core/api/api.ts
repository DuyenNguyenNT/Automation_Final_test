import { APIRequestContext } from '@playwright/test';
import { ENV } from '../../env/env';
import { Logger } from '../utils/logger';

export class APIHelper {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getProfile(token: string) {
        const response = await this.request.get(`${ENV.BASE_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    async updateProfile(name: string, token: string) {
        const response = await this.request.patch(`${ENV.BASE_URL}/api/profile`, {
            data: { name },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    async updateCart(items: any[], token: string) {
        const response = await this.request.put(`${ENV.BASE_URL}/api/cart`, {
            data: { items },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    async clearCart(token: string): Promise<boolean> {
        const response = await this.request.post(`${ENV.BASE_URL}/api/cart/clear`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const success = response.ok();
        if (!success) {
            Logger.error(`API Error: clearCart failed with status ${response.status()} and text: ${await response.text()}`);
        }
        return success;
    }

    async deleteAllOrders(token: string): Promise<boolean> {
        const response = await this.request.delete(`${ENV.BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const success = response.ok();
        if (!success) {
            Logger.error(`API Error: deleteAllOrders failed with status ${response.status()} and text: ${await response.text()}`);
        }
        return success;
    }
}
