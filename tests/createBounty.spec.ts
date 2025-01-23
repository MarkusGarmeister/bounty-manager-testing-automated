import { test, expect } from "../utils/fixtures";
import { CreateBountyPage } from "../PageObjectModels/CreateBountyPageModel.ts";
import { MainBountyPage } from "../PageObjectModels/MainBountyMangerPageModal.ts";
import { signTransaction } from "../utils/signTransaction";
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

test("Creates Bounty and fowards it to status funded", async ({
  webPage,
  context,
}) => {
  const mbp = new MainBountyPage(webPage);
  const cbp = new CreateBountyPage(webPage);
  await webPage.pause();
  await mbp.menu.waitFor();
  await mbp.menu.click();
  await mbp.newBountyButton.waitFor();
  await mbp.newBountyButton.click();
  const title = "This is a test Bounty";
  await cbp.bountyTitle.type(title);
  await cbp.bountyValue.type("12345");
  await webPage.waitForTimeout(1000);
  //await expect(cbp.bountyBond).toHaveText("1.11 DOT");
  await signTransaction(context, cbp.submitButton);
  await webPage.waitForTimeout(2000);
  await webPage.locator(".fill-white").click();
  await cbp.proceedButton.click();
  await signTransaction(context, cbp.submitButton); // Bounty created
  await webPage.waitForTimeout(3000);
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
  await webPage.locator(".fill-white").click();
  await mbp.bountyManagerLogo.waitFor();
  await mbp.bountyManagerLogo.click();
  await webPage.reload();
  const bountyId = await getLatestBountyId();
  await expect(mbp.bountyHeader.nth(0)).toHaveText(`#${bountyId} ${title}`);
  await expect(mbp.bountyStatus.nth(0)).toHaveText("funded");
});

test("Curator Proposal", async ({ webPage, context }) => {
  const mbp = new MainBountyPage(webPage);
  const cbp = new CreateBountyPage(webPage);
  await mbp.curatorPropsalButton.waitFor();
  await mbp.curatorPropsalButton.click();
  await cbp.proceedButton.waitFor();
  await cbp.proceedButton.click();
  console.log(process.env.CURATOR_ADDRESS);
  await cbp.curatorAddress.fill(process.env.CURATOR_ADDRESS);
  await cbp.curatorFee.fill("200");
  const smallSpender = await webPage.locator(
    'button:has-text("Small Spender")'
  );
  await smallSpender.click();
  const bigSpender = await webPage.locator('button:has-text("Big Spender")');
  await bigSpender.waitFor();
  await bigSpender.click();
  await signTransaction(context, cbp.submitButton);
  await webPage.waitForTimeout(3000);
  await placeDecisionDeposit();
  await webPage.waitForTimeout(3000);
  await forwardInHours(4, 1);
  await forwardInDays(28);
  await forwardInDays(7);
  await forwardInBlocks(2);
  await forwardInDays(1, 2);
  await webPage.locator(".fill-white").click();
  await mbp.bountyManagerLogo.click();
  await webPage.reload();
  await expect(mbp.acceptCuratorRole).toBeVisible();
  await mbp.acceptCuratorRole.click();
  await webPage.getByLabel("I agree").click();
  const signCuratorRole = webPage.getByRole("button", { name: "SIGN" });
  await signTransaction(context, signCuratorRole);
});

test("Accept Curator Role", async ({ webPage, context }) => {
  const mbp = new MainBountyPage(webPage);
  const cbp = new CreateBountyPage(webPage);
  await mbp.acceptCuratorRole.click();
  await webPage.getByLabel("I agree").click();
  const signCuratorRole = webPage.getByRole("button", { name: "SIGN" });
  await signTransaction(context, signCuratorRole);
  await webPage.waitForTimeout(2000);
  await webPage.locator(".fill-white").click();
  await expect(mbp.extendBounty).toBeVisible();
});
