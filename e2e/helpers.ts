import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run authenticated tests');
  await page.getByPlaceholder('Enter your email').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.locator('form button[type="submit"]').click();
  
  // Wait until navigation to admin overview completes
  await page.waitForURL(/\/(admin|consultant)/, { timeout: 15000 });
}
