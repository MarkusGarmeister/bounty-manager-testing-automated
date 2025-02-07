import { Page } from "@playwright/test";

export async function importWallet(
  page: Page,
  walletDetails: {
    descriptiveName: string;
    password: string;
    secretKey: string;
  }[]
): Promise<void> {
  await page.locator('button:has-text("Understood, let me continue")').click();
  for (const wallet of walletDetails) {
    await page.locator(".popupToggle").first().click();
    await page.getByRole("link", { name: "Import account from pre-" }).click();
    await page.locator("textarea.sc-hKgKIp.jjwdJy").fill(wallet.secretKey);
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    const descriptiveNameField = page.locator("input.sc-eCstZk.jWiums").nth(0);
    const passwordField = page.locator('input[type="password"]').nth(0);
    const repeatPasswordField = page.locator('input[type="password"]').nth(1);
    await descriptiveNameField.type(wallet.descriptiveName);
    await passwordField.fill(wallet.password);
    await repeatPasswordField.fill(wallet.password);
    const addAccountButton = page.locator(
      'button:has-text("Add the account with the supplied seed")'
    );

    await addAccountButton.click();
  }
}
