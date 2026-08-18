import { test } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import testData from '../env/test-data/testData.json';

test(' Case 1: Login failed with blank password', async ({ loginPage }) => {
  Logger.info('Navigating to login page');
  await loginPage.navigate();

  Logger.info('Attempting login with invalid credentials');
  await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);

  Logger.info('Verifying login failure');
  await loginPage.verifyLoginFailure();
});
