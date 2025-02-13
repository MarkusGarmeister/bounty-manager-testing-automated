import {
  test as base,
  chromium,
  Page,
  type BrowserContext,
} from "@playwright/test";
import path from "path";
import dotenv from "dotenv";
import { initApi } from "./polkadotAPI";
import { importWallet } from "./importWallet";

dotenv.config();
// before each test the api will be started and the wallet imported
base.beforeAll(async () => {
  await initApi();
});

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  walletDetails: {
    descriptiveName: string;
    password: string;
    secretKey: string;
  }[];
  webPage: Page;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, "PolkadotWallet");
    const context = await chromium.launchPersistentContext("", {
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
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
  walletDetails: async ({ }, use) => {
    await use([
      {
        descriptiveName: "Bounty Creator",
        password: process.env.POLKADOT_WALLET_PASSWORD,
        secretKey: process.env.POLKADOT_WALLET_SECRET_KEY,
      },

      {
        descriptiveName: "Curator",
        password: process.env.POLKADOT_WALLET_PASSWORD,
        secretKey: process.env.CURATOR_WALLET_SECRET_KEY,
      },
      {
        descriptiveName: "No Creator",
        password: process.env.POLKADOT_WALLET_PASSWORD,
        secretKey: process.env.NOT_CURATOR_SECTRET_KEY,
      },
    ]);
  },
  webPage: async ({ page, extensionId, context, walletDetails }, use) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);

    await importWallet(page, walletDetails);

    await page.goto(process.env.BOUNTY_MANAGER_URL);
    await page.waitForTimeout(1000);

    const signInButton = page.getByRole("button", { name: "Connect Wallet" });
    await signInButton.waitFor();
    await signInButton.click();
    const polkadotConnect = await page.getByRole("button", {
      name: "Logo Polkadot.js Connect",
    });
    const polkadotConnectIsVisible = await polkadotConnect.isVisible();
    if (!polkadotConnectIsVisible) {
      const closeButton = await page.getByRole("button", { name: "cancel" });
      await closeButton.click();
      await signInButton.click();
    }
    const walletPromise = context.waitForEvent("page");
    await polkadotConnect.click();
    const walletPage = await walletPromise;
    await walletPage
      .locator("label")
      .filter({ hasText: "Select all" })
      .locator("span")
      .click();
    await walletPage.locator(".acceptButton").click();
    console.log(`${walletDetails[0].descriptiveName}`);
    await page.getByText(`${walletDetails[0].descriptiveName}`, { exact: true }).click();
    await use(page);
  },
});
export const expect = test.expect;
