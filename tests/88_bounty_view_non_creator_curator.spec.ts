import { test, expect } from "../utils/fixtures.ts";
import { CreateBountyPage } from "../PageObjectModels/CreateBountyPageModel.ts";
import { MainBountyPage } from "../PageObjectModels/MainBountyMangerPageModal.ts";
import { signTransaction } from "../utils/signTransaction.ts";
import {
    placeDecisionDeposit,
    forwardInHours,
    forwardInDays,
    forwardInBlocks,
    getLatestBountyId,
    getFundingPeriod,
} from "../utils/polkadotAPI.ts";

import dotenv from "dotenv";

dotenv.config();



test("BM-88 | Creates Bounty and fowards it to status funded", async ({
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
    await webPage.waitForTimeout(4000);
    await expect(cbp.bountyBond).toHaveText("1.21 DOT");
    await expect(cbp.transactionFees).toHaveText("0.01502 DOT");
    await cbp.submitButton.isDisabled();
  
    // I click on the Submit button and I sign the transaction
    await signTransaction(context, cbp.submitButton);
    await webPage.waitForTimeout(2000);
    await webPage.getByRole('button', { name: 'Close icon' }).click();
  
    // I am on the Bounty creation success screen, after creating a Bounty
    const bountyId = await getLatestBountyId();
    const bountyHeader1 = webPage.locator("div.bg-backgroundButtonLight").locator("p");
    await expect(bountyHeader1).toHaveText(`#${bountyId} ${title}`);
  
    // I go to the Bounty Manager and click on the "Approval" tab
    await cbp.approvalTab.click();
    await webPage.waitForTimeout(2000);
    await expect(cbp.approvalDeposit).toHaveText("1 DOT");
    await expect(cbp.approvalTransactionFees).toHaveText("0.01336 DOT");
    await expect(bountyHeader1).toHaveText(`#${bountyId} ${title}`);
  
  
    // On the Bounty Manager "Approval" tab, I press on the "Treasury Track" and choose one value from the dropdown menu
    await cbp.treasuryTrack.click();
    await webPage.getByRole('menuitem', { name: 'Small Spender' }).click();
    await expect(cbp.treasuryTrack).toContainText('Small Spender');
  
    await cbp.treasuryTrack.click();
    await webPage.getByRole('menuitem', { name: 'Big Spender' }).click();
    await expect(cbp.treasuryTrack).toContainText('Big Spender');
  
    await cbp.treasuryTrack.click();
    await webPage.getByRole('menuitem', { name: 'Medium Spender' }).click();
    await expect(cbp.treasuryTrack).toContainText('Medium Spender');
  
    // I am on the Bounty Approval referendum screen, I click on the "Submit" button and I sign the transaction
    await signTransaction(context, cbp.submitButton); // Bounty created
    await webPage.waitForTimeout(3000);  
  
    // Automated Decision Deposit Placement and Status Transition Workflow on a Substrate-based Blockchain (steps: 14, 15, 16, 17, 18, 19, 20)
    await placeDecisionDeposit();
    await webPage.waitForTimeout(3000);
    await forwardInHours(4, 1); // status: Preparing --> Deciding
    await forwardInDays(28); // status: Deciding --> Confirming
    await forwardInDays(4); // status: Confirming --> Bounty goes to Referrenda (check Sheduler)
    await forwardInBlocks(2); // accept
    await forwardInDays(1, 2); // Bounty approved
    const fundingPeriod = await getFundingPeriod(); // returns the blocks until funding Period is finished
    await forwardInBlocks(fundingPeriod); // funding period ended and bounty is funded
    await webPage.waitForTimeout(1000);
    await webPage.getByRole('button', { name: 'Close icon' }).click();
    await webPage.getByRole('link', { name: 'RETURN HOME' }).click();
    await mbp.bountyManagerLogo.waitFor();
    await mbp.bountyManagerLogo.click();
    await webPage.reload();
    await expect(mbp.bountyHeader.nth(0)).toHaveText(`#${bountyId} ${title}`);
    await expect(mbp.bountyStatus.nth(0)).toHaveText("funded");
  });



test("BM-88 | Curator Proposal", async ({ webPage, context }) => {
    const mbp = new MainBountyPage(webPage);
    const cbp = new CreateBountyPage(webPage);

    const title = "This is a test Bounty";
    const bountyId = await getLatestBountyId();
    const lastBounty = mbp.bountyHeader.last();


    // I go to Curator Proposal Referendum page 
    await mbp.curatorPropsalButton.waitFor();
    await mbp.curatorPropsalButton.click();

    // On the Curator Proposal Referendum page I press on the proceed button
    await cbp.proceedButton.waitFor();
    await cbp.proceedButton.click();

    // I am on the Curator Proposal tab and I fill in the Curator address and curator fee
    await cbp.curatorAddress.fill(process.env.POLKADOT_ADDRESS);
    await cbp.curatorFee.fill("200");

    // On the Curator Proposal tab, I check the "Treasury Track"
    const smallSpender = await webPage.locator(
        'button:has-text("Small Spender")'
    );
    await smallSpender.click();
    const bigSpender = webPage.locator('button:has-text("Big Spender")');
    await bigSpender.waitFor();
    await bigSpender.click();

    // I am on the curator proposal tab with all required fields filled, I click on the "Submit" button and I sign the transaction
    await signTransaction(context, cbp.submitButton);
    await webPage.waitForTimeout(3000);

    // The transaction process is successful
    await webPage.getByRole('button', { name: 'Close icon' }).click();

    await placeDecisionDeposit();
    await webPage.waitForTimeout(3000);
    await forwardInHours(4, 1);
    await forwardInDays(28);
    await forwardInDays(7);
    await forwardInBlocks(2);
    await forwardInDays(1, 2);

    // I am on the Bounty Manager and I sign in with the Proposed Curator address
    await webPage.waitForTimeout(3000);
    await mbp.bountyManagerLogo.click({ force: true });
    await webPage.waitForTimeout(2000);
    await webPage.reload();
    await expect(mbp.acceptCuratorRole).toBeVisible();

    // I am on the Bounty Manager and I sign in with the Bounty creator address
    await expect(mbp.bountyHeader.nth(0)).toHaveText(`#${bountyId} ${title}`);


    //  I am on the Bounty Manager and I sign in with an account that is NOT a Bounty Creator/Curator/Subcurator
    await mbp.menu.click();
    await mbp.logoutButton.click();
    await mbp.connectWallet.click();
    await mbp.polkadotConnect.click();
    await mbp.noCuratorAddress.click();
    await mbp.bountyManagerLogo.click();
    await expect(lastBounty).toBeHidden();

});



