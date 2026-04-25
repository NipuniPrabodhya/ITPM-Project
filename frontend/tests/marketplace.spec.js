import { test, expect } from '@playwright/test';

test.describe('UniNexus Marketplace - User Journeys', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the local frontend server before each test
    await page.goto('http://localhost:3000/');
  });

  test('User can view the marketplace and see products', async ({ page }) => {
    // Wait for the hero banner to appear
    await expect(page.locator('h1.hero-title')).toContainText('UniNexus Marketplace');
    
    // Check if the Trending Listings or All Available Items sections exist
    const marketplaceHeaders = page.locator('h3', { hasText: 'Items' });
    await expect(marketplaceHeaders.first()).toBeVisible();

    // Ensure that product cards are loaded (wait for at least one card)
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 10000 });
  });

  test('User can search and filter products', async ({ page }) => {
    // Type in the search box
    const searchInput = page.getByPlaceholder('Search items by title or description...');
    await searchInput.fill('laptop');

    // Filter by Category
    const categoryFilter = page.locator('.filter-dropdown').nth(0);
    await categoryFilter.selectOption('Electronics');

    // Ensure the UI updates (could either show products or the empty state)
    // We expect the app to handle it gracefully without crashing.
    const productGrid = page.locator('.product-grid');
    const emptyState = page.locator('text=No items found!');
    await Promise.race([
        expect(productGrid).toBeVisible(),
        expect(emptyState).toBeVisible()
    ]);
  });

  test('AI Chatbot can be opened and closed', async ({ page }) => {
    // Click the floating chatbot button
    const chatButton = page.locator('button', { hasText: '💬' });
    await chatButton.waitFor({ state: 'visible' });
    await chatButton.click();

    // Verify the chatbot window opens
    const chatHeader = page.locator('strong', { hasText: 'UniNexus Assistant' });
    await expect(chatHeader).toBeVisible();

    // Verify the initial bot message is there
    await expect(page.locator('text=Hi! I am your UniNexus assistant')).toBeVisible();

    // Close the chatbot
    const closeButton = page.locator('button', { hasText: '×' });
    await closeButton.click();
    
    // Ensure the chat window is closed
    await expect(chatHeader).not.toBeVisible();
  });

  test('User can navigate to Login and Register', async ({ page }) => {
    // Click Login
    await page.click('text=Login');
    await expect(page.locator('h2')).toContainText('Welcome Back');

    // Click Register
    await page.click('text=Register');
    await expect(page.locator('h2')).toContainText('Join UniNexus');
  });
});
