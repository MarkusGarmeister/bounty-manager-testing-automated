import { chromium } from "@playwright/test";
import { test, expect } from "../utils/fixtures.ts";
import { CreateBountyPage } from "../PageObjectModels/CreateBountyPageModel.ts";
import { MainBountyPage } from "../PageObjectModels/MainBountyMangerPageModal.ts";
import { signTransaction } from "../utils/signTransaction.ts";

import dotenv from "dotenv";

dotenv.config();

test("BM-84 | Creates Bounty and fowards it to status funded", async ({
    webPage,
    context,
  }) => {
    const mbp = new MainBountyPage(webPage);
    const cbp = new CreateBountyPage(webPage);
    await mbp.menu.waitFor();
    await mbp.menu.click();
    await mbp.newBountyButton.waitFor();
    await mbp.newBountyButton.click();
    
  
    // On the Bounty Manager I click on the "Creation" tab
    await cbp.creationTab.click();
    await expect(cbp.bountyTitle).toBeVisible();
    await expect(cbp.bountyValue).toBeVisible();
    await expect(cbp.bountyBond).toBeVisible();
    await expect(cbp.transactionFees).toBeVisible();

    // I fill in the "Bounty Title" and "Bounty Value" input fields 
    await cbp.submitButton.isEnabled();
    const title = "This is a test Bounty";
    await cbp.bountyTitle.type(title);
    await cbp.bountyValue.type("12345");
    await webPage.waitForTimeout(3000);
    await expect(cbp.bountyBond).toHaveText("1.21 DOT");
    await expect(cbp.transactionFees).toHaveText("0.01502 DOT");
    await cbp.submitButton.isDisabled();

    // 🚀 1. Retrieve the Bounty Bond and Transaction Fee from the main page (cbp) BEFORE opening a new browser
    const bountyBondText = await cbp.bountyBond.innerText();
    const formattedBounntyBondText = bountyBondText.slice(0,4)
    const transactionFeesText = await cbp.transactionFees.innerText();
    const formattedTransactionFees = transactionFeesText.slice(0, 7);

    // I click on the Submit button and I sign the transaction
    await signTransaction(context, cbp.submitButton);
    await webPage.waitForTimeout(2000);
    await webPage.getByRole('button', { name: 'Close icon' }).click();

    // I go to https://polkadot.js.org/apps/?rpc=ws%3A%2F%2Flocalhost%3A8000#/explorer, click on the latest block and find the newly created bounty

      // 🚀 2. Open a new browser instance and navigate to Polkadot Explorer to fetch the actual transaction fee
      const browser = await chromium.launch({ headless: false });
      const context1 = await browser.newContext();
      const page1 = await context1.newPage();
      await page1.goto("https://polkadot.js.org/apps/?rpc=ws%3A%2F%2Flocalhost%3A8000#/explorer");

      // 🚀 3. Click on the latest block to find the newly created bounty
      const firstBounty = page1.locator('tr td.number h4.--digits a');
      await firstBounty.click();

      // 🚀 4. Expand the dropdown to reveal the transaction fee
      const transactionFeeDropdownArrow = page1.locator('.ui--Expander-summary.isLeft:has-text("TransactionFeePaid") svg path');
      await transactionFeeDropdownArrow.first().click();

      // 🚀 5. Retrieve the actual transaction fee from the bounty details
      const actualFeeLocator = page1.locator('input[data-testid^="actualFee"]');
      const actualFeeValue = await actualFeeLocator.getAttribute('value');

      // Format the fee value (extract only the first 6 characters)
      const formattedFee = actualFeeValue ? actualFeeValue.slice(0, 7) : null;

      // 🚀 6. Compare the retrieved transaction fee with the expected value
      expect(formattedFee).toBe(formattedTransactionFees);

      // 🚀 7. Navigate to the Bounties page and expand the first bounty
      await page1.getByText('Governance').click();
      await page1.getByRole('link', { name: 'Bounties' }).click();
      const firstBountyArrow = page1.getByTestId('row-toggle').first();
      await firstBountyArrow.click();

      // 🚀 8. Retrieve the actual Bounty Bond value from the expanded bounty details
      const actualBountyBond = page1.locator('.column:has(h5:has-text("Bond")) .ui--FormatBalance-value').first();
      const actualBountyBondText = await actualBountyBond.innerText();

      // Format the bond value (remove " DOT" and extract only the first 4 characters)
      const formattedBountyBond = actualBountyBondText.replace(" DOT", "").trim().slice(0, 4);

      // 🚀 9. Compare the retrieved Bounty Bond value with the expected value
      expect(formattedBountyBond).toBe(formattedBounntyBondText);

      // 🚀 10. Close the browser after performing all comparisons
      await browser.close();

 });