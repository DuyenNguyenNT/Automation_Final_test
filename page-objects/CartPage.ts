import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../env/env';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartIcon: Locator;
  readonly totalAmount: Locator;

  // String selectors for scoping within a specific cart item
  readonly productNameSelector = '.item-name';
  readonly productPriceSelector = '.item-price';
  readonly quantitySelector = '.qty-value';
  readonly qtyBtnSelector = '.qty-btn';
  readonly itemTotalSelector = '.item-total';
  readonly removeButtonSelector = '.remove-btn';

  constructor(page: Page) {
    super(page);

    this.cartItems = page.locator('.cart-item');
    this.checkoutButton = page.locator('.checkout-btn');
    this.emptyCartIcon = page.locator('.empty-icon');
    this.totalAmount = page.locator('.cart-total, .total-amount');
  }

  async navigate() {
    await this.goto(ENV.CART_URL);
  }

  /**
   * Helper to get a specific cart item row by the product name
   */
  getCartItem(productName: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator(this.productNameSelector, {
        hasText: productName,
      }),
    });
  }

  async getProductPrice(productName: string): Promise<string | null> {
    const item = this.getCartItem(productName);
    return await item.locator(this.productPriceSelector).textContent();
  }

  async getProductQuantity(productName: string): Promise<string | null> {
    const item = this.getCartItem(productName);
    // Wait for the item to be visible before getting the quantity
    await item.waitFor({ state: 'visible', timeout: 5000 });
    return await item.locator(this.quantitySelector).textContent();
  }

  async increaseProductQuantity(productName: string) {
    const item = this.getCartItem(productName);
    // Assuming the last button is "Increase" based on previous specs
    await item.locator(this.qtyBtnSelector).last().click();
  }

  async decreaseProductQuantity(productName: string) {
    const item = this.getCartItem(productName);
    // Assuming the first button is "Decrease" based on previous specs
    await item.locator(this.qtyBtnSelector).first().click();
  }

  async removeProduct(productName: string) {
    const item = this.getCartItem(productName);
    await item.locator(this.removeButtonSelector).click();
    // Wait for the item to be removed from the DOM
    await item.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async getProductTotal(productName: string): Promise<string | null> {
    const item = this.getCartItem(productName);
    return await item.locator(this.itemTotalSelector).textContent();
  }

  async verifyOnCartPage() {
    await expect(this.page).toHaveURL(ENV.CART_URL);
  }

  async getCartItemCount(): Promise<number> {
    // Wait for the first item to appear before counting, in case the cart loads slowly
    // If no items appear within the timeout, it will throw an error, failing the test as expected.
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If it fails, it means the cart is empty, so we can safely return 0.
      return 0;
    });
    return await this.cartItems.count();
  }

  async verifyCartIsEmpty() {
    await expect(this.emptyCartIcon).toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getCartTotal(): Promise<string | null> {
    return await this.totalAmount.textContent();
  }
}
