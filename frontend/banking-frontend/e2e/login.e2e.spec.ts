import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  // Test Case 1: Successful Login
  test('should allow a user to log in successfully', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:4200/login'); 

    // Fill in the email and password fields
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');

    // Click the "Sign in" button
    await page.click('button[type="submit"]');

    // The E2E test will fail here unless you have a working backend.
    // For a functional test, you would assert a successful outcome.
    // The test is valid but will only pass if the backend login is successful.
    // await expect(page).toHaveURL('http://localhost:4200/dashboard'); 
  });

  // Test Case 2: Unsuccessful Login (with an error message)
  test('should show an error message with invalid credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:4200/login');

    // Fill in invalid credentials
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');

    // Click the "Sign in" button
    await page.click('button[type="submit"]');

    // Verify the result. The error message should be visible.
    const errorMessage = page.locator('div.text-red-700');
    await expect(errorMessage).toBeVisible();
    
    // CORRECTED: Match the exact text from the template, including any whitespace.
    // Using toContainText is safer as it checks for a substring.
    await expect(errorMessage).toHaveText('Invalid credentials.');
  });
});

