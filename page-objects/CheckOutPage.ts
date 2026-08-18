import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../env/env';

export class CheckoutPage extends BasePage {
  // Form Inputs
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly submitOrderButton: Locator;

  // Success Screen Elements
  readonly successHeading: Locator;
  readonly receiverName: Locator;
  readonly receiverAddress: Locator; // Restoring this property
  readonly paymentMethod: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);

    this.nameInput = page.getByTestId('checkout-name');
    this.phoneInput = page.getByTestId('checkout-phone');
    this.addressInput = page.getByTestId('checkout-address');
    this.submitOrderButton = page.locator('.btn-checkout, button[type="submit"]');

    // Locators for success page using the correct strategy
    this.successHeading = page.locator('h2:has-text("Đặt hàng thành công!")');
    this.receiverName = page.locator('p:has-text("Người nhận:") > strong');
    // Use the adjacent sibling combinator (+) to find the <p> right after the name's <p>
    this.receiverAddress = page.locator('p:has-text("Người nhận:") + p');
    this.paymentMethod = page.locator('.checkout-success p strong').filter({ hasText: 'Tiền mặt khi nhận hàng' });
    this.continueShoppingButton = page.locator('a.btn:has-text("Tiếp tục mua sắm")');
  }

  async navigate() {
    await this.goto(ENV.CHECKOUT_URL);
  }

  async verifyOnCheckoutPage() {
    await expect(this.page).toHaveURL(ENV.CHECKOUT_URL);
  }

  /**
   * Fills out the checkout form with the provided details
   */
  async fillCheckoutForm(name: string, phone: string, address: string) {
    await this.nameInput.fill(name);
    await this.phoneInput.fill(phone);
    await this.addressInput.fill(address);
  }

  /**
   * Submits the order
   */
  async submitOrder() {
    await this.submitOrderButton.click();
  }

  /**
   * Verifies that the success screen contains the expected information.
   * It checks for visibility and the exact text content of each field.
   */
  async verifySuccessScreen(name: string, address: string, payment: string) {
    // Wait for the success heading to be visible and verify all fields
    await expect(this.successHeading).toBeVisible();
    await expect(this.receiverName).toHaveText(name);
    await expect(this.receiverAddress).toHaveText(address);
    await expect(this.paymentMethod).toContainText(payment);
  }
}
