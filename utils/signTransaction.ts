import { BrowserContext, Locator, Page } from '@playwright/test';

export async function signTransaction(context: BrowserContext, submitButton: Locator) {
  // Wait for the wallet page to open
  const walletPromise = context.waitForEvent('page');
  await submitButton.click();

  // Get the wallet page instance
  const walletPage = await walletPromise;

  // Type password and sign the transaction
  await walletPage.getByRole('textbox').type(process.env.POLKADOT_WALLET_PASSWORD || '');
  await walletPage.getByRole('button', { name: 'Sign the transaction' }).click();

  // Close the wallet page
  await walletPage.close();
}