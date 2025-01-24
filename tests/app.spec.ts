import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 24.9344, latitude: 60.1797 },
  permissions: ['geolocation'],
});

test('has title of DOPC', async ({ page }) => {
  await page.goto('localhost:5173');
  await expect(page).toHaveTitle('DOPC');
});

test.describe('Correct Price Calculations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill(
      '[data-test-id="venue-slug-input"]',
      'home-assignment-venue-helsinki',
    );
    await page.fill('[data-test-id="cart-value-input"]', '5');
    await page.click('button[type="button"]');
    await page.click('button[type="submit"]');

    //wait until calculation is complete
    await page.waitForFunction(
      () => {
        const element = document.querySelector('p[data-test-id="total-price"]');
        return element && element.textContent !== '0';
      },
      { timeout: 5000 },
    );
  });

  test('should show correct cartValue in price breakdown', async ({ page }) => {
    const cartValue = await page.waitForSelector('[data-test-id="cart-value"]');
    const cartValueRaw = await cartValue.getAttribute('data-raw-value');
    expect(cartValueRaw).toBe('500');
  });

  test.only('should calculate correct deliveryDistance in price breakdown', async ({
    page, }) => { 
      const deliveryDistance = await page.waitForSelector('[data-test-id="delivery-distance"]');
      const deliveryDistanceRaw = await deliveryDistance.getAttribute('data-raw-value');
      expect(deliveryDistanceRaw).toBe('1121.2836643787462');
    });

  test('should calculate correct deliveryFee in price breakdown', async ({
    page,
  }) => {
    const deliveryFee = await page.waitForSelector(
      '[data-test-id="delivery-fee"]',
    );
    const deliveryFeeRaw = await deliveryFee.getAttribute('data-raw-value');
    expect(deliveryFeeRaw).toBe('390');
  });

  test('should calculate correct minimum_order_surcharge in price breakdown', async ({
    page,
  }) => {
    const smallOrderSurcharge = await page.waitForSelector(
      '[data-test-id="small-order-surcharge"]',
    );
    const smallOrderSurchargeRaw =
      await smallOrderSurcharge.getAttribute('data-raw-value');
    expect(smallOrderSurchargeRaw).toBe('500');
  });

  test('should calculate correct total price in price breakdown and show success toast', async ({
    page,
  }) => {
    const totalPrice = await page.waitForSelector(
      '[data-test-id="total-price"]',
    );
    const totalPriceRaw = await totalPrice.getAttribute('data-raw-value');
    const toast = await page.waitForSelector('div.Toastify__toast', {
      timeout: 5000,
    });
    expect(totalPriceRaw).toBe('1390');
    const toastInnerText = await toast.innerText();
    expect(toastInnerText).toContain('Price calculated successfully');
  });
});

test.describe('Incorrect Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should inform user of no possible delivery with a warning toast', async ({
    page,
  }) => {
    await page.fill(
      '[data-test-id="venue-slug-input"]',
      'home-assignment-venue-tallinn',
    );
    await page.fill('[data-test-id="cart-value-input"]', '5');
    await page.click('button[type="button"]');
    await page.click('button[type="submit"]');
    const toast = await page.waitForSelector('div.Toastify__toast', {
      timeout: 5000,
    });
    const toastInnerText = await toast.innerText();
    expect(toastInnerText).toContain('No delivery available near you');
  });

  test('should inform user of incorrect venue slug with a warning toast', async ({
    page,
  }) => {
    await page.fill(
      '[data-test-id="venue-slug-input"]',
      'Incorrect Venue input',
    );
    await page.fill('[data-test-id="cart-value-input"]', '5');
    await page.click('button[type="button"]');
    await page.click('button[type="submit"]');
    const toast = await page.waitForSelector('div.Toastify__toast', {
      timeout: 5000,
    });
    const toastInnerText = await toast.innerText();
    expect(toastInnerText).toContain('Incorrect venue slug');
  });

  test('should inform user of empty venue slug value with a warning toast', async ({
    page,
  }) => {
    await page.fill('[data-test-id="venue-slug-input"]', '');
    await page.click('button[type="button"]');
    await page.click('button[type="submit"]');
    const toast = await page.waitForSelector('div.Toastify__toast', {
      timeout: 5000,
    });
    const toastInnerText = await toast.innerText();
    expect(toastInnerText).toContain('No venue slug given');
  });

  test('should inform user of empty cart value with a warning toast', async ({
    page,
  }) => {
    await page.fill(
      '[data-test-id="venue-slug-input"]',
      'home-assignment-venue-helsinki',
    );
    await page.click('button[type="button"]');
    await page.click('button[type="submit"]');
    const toast = await page.waitForSelector('div.Toastify__toast', {
      timeout: 5000,
    });
    const toastInnerText = await toast.innerText();
    expect(toastInnerText).toContain('No cart value given');
  });

  test('should inform user of empty location values with a warning toast', async ({
    page,
  }) => {
    await page.fill(
      '[data-test-id="venue-slug-input"]',
      'home-assignment-venue-helsinki',
    );
    await page.fill('[data-test-id="cart-value-input"]', '5');
    await page.click('button[type="submit"]');
    const toast = await page.waitForSelector('div.Toastify__toast', {
      timeout: 5000,
    });
    const toastInnerText = await toast.innerText();
    expect(toastInnerText).toContain('No user location value given');
  });
});
