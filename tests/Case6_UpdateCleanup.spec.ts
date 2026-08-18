import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { APIHelper } from '../core/api/api';
import testData from '../env/test-data/testData.json';

test.describe('Case 6: Update Full Name in profile, then clean up via API', () => {

    let userToken = '';
    let initialNameFromAPI: string;
    const updatedName = testData.updatedName;

    test.beforeEach(async ({ loggedInUser, request }) => {
        userToken = loggedInUser;
        Logger.info('User is logged in via fixture');

        const api = new APIHelper(request);
        const profileInfo = await api.getProfile(userToken);
        initialNameFromAPI = profileInfo.name || (profileInfo.data && profileInfo.data.name) || testData.validUser.originalName;
        Logger.info(`Fetched initial name from API: ${initialNameFromAPI}`);
    });

    test('Update Full Name via API, verify, and restore', async ({ profilePage, request }) => {
        const api = new APIHelper(request);

        // 1. Navigate to Profile Page and verify initial state
        Logger.info('Navigating to the Profile Page');
        await profilePage.navigate();
        await profilePage.verifyOnProfilePage();
        const currentName = await profilePage.getProfileName();
        expect(currentName).toBe(initialNameFromAPI);

        // 2. Update Profile Name via API
        Logger.info(`Updating profile name to: ${updatedName} via API`);
        await api.updateProfile(updatedName, userToken);

        // 3. Verify on UI
        Logger.info('Verifying updated name on UI');
        await profilePage.reload(); // Reload the page to see the changes made by the API
        const savedName = await profilePage.getProfileName();
        expect(savedName).toBe(updatedName);

        // 4. Verify via API (confirms the change again)
        Logger.info('Verifying updated name via API');
        let profileInfo = await api.getProfile(userToken);
        const apiSavedName = profileInfo.name || (profileInfo.data && profileInfo.data.name);
        expect(apiSavedName).toBe(updatedName);

        // 5. Cleanup: Restore original name
        Logger.info('Cleaning up: Restoring original profile name via API');
        await api.updateProfile(initialNameFromAPI, userToken);

        // 6. Final Verification: Ensure name was restored
        Logger.info('Verifying name was restored via API');
        profileInfo = await api.getProfile(userToken);
        const restoredName = profileInfo.name || (profileInfo.data && profileInfo.data.name);
        expect(restoredName).toBe(initialNameFromAPI);



        Logger.info('Scenario 6 completed successfully');
    });
});
