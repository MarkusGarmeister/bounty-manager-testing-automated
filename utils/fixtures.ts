import { test as base, chromium, Page, type BrowserContext } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv'

dotenv.config()

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  webPage: Page;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, 'PolkadotWallet');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
   
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
  webPage: async({ page, extensionId, context }, use) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page.locator('button:has-text("Understood, let me continue")').click();
    await page.locator('svg').first().click()
    await page.getByRole('link', { name: 'Import account from pre-' }).click()
    await page.locator("textarea.sc-hKgKIp.jjwdJy").fill(process.env.POLKADOT_WALLET_SECRET_KEY);
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    const descriptiveNameField = page
        .locator("input.sc-eCstZk.jWiums")
        .nth(0);
    const passwordField = page.locator('input[type="password"]').nth(0);
    const repeatPasswordField = page.locator('input[type="password"]').nth(1);
    await descriptiveNameField.type("test");
    await passwordField.fill(process.env.POLKADOT_WALLET_PASSWORD);
    await repeatPasswordField.fill(process.env.POLKADOT_WALLET_PASSWORD);
    const addAccountButton = page.locator('button:has-text("Add the account with the supplied seed")');

    await addAccountButton.click();
    await page.goto(process.env.BOUNTY_MANAGER_URL)
    await page.waitForTimeout(1000)
  
    const signInButton = page.getByRole('button', { name: 'Connect Wallet' });
    await signInButton.waitFor()
    await signInButton.click()

    const polkadotConnect = await page.getByText('Logos/polkadot-js-wallet 2 Polkadot.js Connect Buttons/Back')
    const polkadotConnectIsVisible = await polkadotConnect.isVisible()
    if (!polkadotConnectIsVisible) {
        const closeButton = await page.locator('.ml-auto > .s-D2WQl_trxvyh')
        await closeButton.click()
        await signInButton.click()
    }
    const walletPromise = context.waitForEvent('page')
    await polkadotConnect.click()
    const walletPage = await walletPromise
    await walletPage.locator('label').filter({ hasText: 'Select all' }).locator('span').click()
    await walletPage.getByRole('button', { name: 'Connect 1 account(s)' }).click()
    await page.getByText('test 14DKoXcdhLjWBwASvFzK... Select Buttons/Back').click()
    await use(page)
  }
});
export const expect = test.expect;