import { APIRequestContext } from '@playwright/test';
import { APIHelper } from '../api/api';
import { Logger } from '../utils/logger';

// Common hooks that can be imported in tests or setup files
export const setup = async () => {
    Logger.info('Global setup');
};

export const teardown = async () => {
    Logger.info('Global teardown');
};

/**
 * A hook intended to run `afterEach` or `afterAll` in tests.
 * Clears the user's cart and deletes all their orders via API to ensure a clean state.
 */
export const cleanupTestData = async (request: APIRequestContext, token: string) => {
    Logger.info('Cleaning up test data via API...');
    
    if (!token) {
        Logger.error('Cannot clean up data: Missing auth token');
        return;
    }

    try {
        const api = new APIHelper(request);
        
        // 1. Clear Cart
        Logger.info('Clearing user cart...');
        const cartCleared = await api.clearCart(token);
        if (!cartCleared) {
            Logger.warn('Cleanup warning: Clearing cart via API may have failed.');
        }
        
        // 2. Delete Orders
        Logger.info('Deleting all user orders...');
        const ordersDeleted = await api.deleteAllOrders(token);
        if (!ordersDeleted) {
            Logger.warn('Cleanup warning: Deleting orders via API may have failed.');
        }
        
        if (cartCleared && ordersDeleted) {
            Logger.info('Test data cleanup completed successfully');
        } else {
            Logger.error('Test data cleanup FAILED. Check previous API error logs.');
        }
    } catch (error) {
        Logger.error('Failed to clean up test data', error);
    }
};
