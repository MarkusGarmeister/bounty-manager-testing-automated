import { BrowserContext, Locator, Page } from "@playwright/test";

export async function signTransaction(
  context: BrowserContext,
  submitButton: Locator
) {
  /*
  If a button or a different Locator triggers an transaction with the blockchain, you can use this function to sign it.
  It will open the Polkadot Wallet in a new context and enter the Password.
  The context will be closed and you will be on the page, where the Transaction was triggered
  */
  const walletPromise = context.waitForEvent("page");
  await submitButton.click();
  const walletPage = await walletPromise;
  await walletPage
    .getByRole("textbox")
    .type(process.env.POLKADOT_WALLET_PASSWORD || "");
  await walletPage
    .getByRole("button", { name: "Sign the transaction" })
    .click();
  await walletPage.close();
}
