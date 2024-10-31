import { test, expect } from "../utils/fixtures";
import { CreateBountyPage } from "../PageObjectModels/CreateBountyPageModel.ts";
import { MainBountyPage } from "../PageObjectModels/MainBountyMangerPageModal.ts";
import { signTransaction } from "../utils/signTransaction";
import { placeDecisionDeposit, getDeciding } from "../utils/polkadotAPI.ts";

import dotenv from "dotenv";

dotenv.config();

test("Creates Bounty and places Decision deposite", async ({
  webPage,
  context,
}) => {
  const mbp = new MainBountyPage(webPage);
  const cbp = new CreateBountyPage(webPage);
  await mbp.newBountyButton.waitFor();
  await mbp.newBountyButton.click();
  await cbp.bountyTitle.type("Test Bounty");
  await cbp.bountyValue.type("12345");
  await webPage.waitForTimeout(1000);
  await expect(cbp.bountyBond).toHaveText("1.11 DOT");
  await signTransaction(context, cbp.submitButton);
  await webPage.waitForTimeout(2000);
  await webPage.locator(".fill-white").click();
  await cbp.proceedButton.click();
  await signTransaction(context, cbp.submitButton);
  await webPage.waitForTimeout(6000);
  await placeDecisionDeposit();
  //await getDeciding();
});
