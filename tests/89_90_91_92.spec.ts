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

test("BM-89 | Creates Bounty and fowards it to status funded", async ({
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


test("BM-89 | Curator Proposal", async ({ webPage, context }) => {
    const mbp = new MainBountyPage(webPage);
    const cbp = new CreateBountyPage(webPage);

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
    const bigSpender = await webPage.locator('button:has-text("Big Spender")');
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

    // I press on the Curator Role Accept button
    await mbp.acceptCuratorRole.click();

    // I click on the Agree toggle and press the Sign button
    await webPage.getByLabel("I agree").click();
    const signCuratorRole = webPage.getByRole("button", { name: "SIGN" });
    
    // I sign the transaction
    await signTransaction(context, signCuratorRole);
    await webPage.waitForTimeout(2000);
    await webPage.getByRole('button', { name: 'Close icon' }).click();
    await expect(mbp.extendBounty).toBeVisible();

    // I press on the Add New Child Bounty
    await mbp.addChildBountyButton.click();
    

    // I enter Child Bounty Value and Title and press on Sign button
    await webPage.getByPlaceholder('Child bounty name').fill('Test child bounty');
    await webPage.getByPlaceholder('00.00').fill('200');
    const signChildBoundy = webPage.getByRole('button', { name: 'SIGN' });
    await signTransaction(context, signChildBoundy);
    await webPage.waitForTimeout(2000);
    await webPage.getByRole('button', { name: 'Close icon' }).click();


    // I log in as a Subcurator to a child bounty
    await mbp.assignChildBountyButton.click();
    await webPage.getByPlaceholder('00.00').fill('100');
    await webPage.getByRole('textbox').first().fill('19yjupA9jPNuvtX98ZrsV1aKVepgk82ni1jCNXUHjvrt6d4');
    const signButton = webPage.getByRole('button', { name: 'SIGN', exact: true });
    await signTransaction(context, signButton);
    await webPage.getByRole('button', { name: 'Close icon' }).click();

    await mbp.menu.click();
    await mbp.logoutButton.click();
    await mbp.connectWallet.click();
    await mbp.polkadotConnect.click();
    await mbp.noCuratorAddress.click();

    const awardButton = webPage.getByRole('button', { name: 'AWARD' });
    const closeDownButton = webPage.getByRole('button', { name: 'CLOSE DOWN' });
    const unassignButton = webPage.getByRole('button', { name: 'UNASSIGN' });
    const readFirstButton = webPage.getByRole('button', { name: 'READ FIRST' });

    await mbp.acceptSubCuratorButton.click();
    await webPage.getByLabel('I agree').check();
    await signTransaction(context, signChildBoundy);
    await webPage.getByRole('button', { name: 'Close icon' }).click();


    await expect(awardButton).toBeVisible();
    await expect(closeDownButton).not.toBeVisible();
    await expect(unassignButton).not.toBeVisible();
    await expect(readFirstButton).not.toBeVisible();


    // I log in as a Curator
    await mbp.menu.click();
    await mbp.logoutButton.click();
    await mbp.connectWallet.click();
    await mbp.polkadotConnect.click();
    await mbp.bountyCreatorAddress.click();
   
    await expect(awardButton).not.toBeVisible();
    await expect(closeDownButton).toBeVisible();
    await expect(unassignButton).toBeVisible();
    await expect(readFirstButton).not.toBeVisible();
    

    // I close down/Award the Child Bounty
    await closeDownButton.click();
    await webPage.getByLabel('Close down anyway').check();
    await signTransaction(context, signButton)
    await webPage.getByRole('button', { name: 'Close icon' }).click();
    await expect(readFirstButton).toBeVisible();

    
  });