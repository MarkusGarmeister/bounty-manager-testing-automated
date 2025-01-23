import { test, expect } from "../utils/fixtures";
import { MainBountyPage } from "../PageObjectModels/MainBountyMangerPageModal.ts";

test.beforeEach(async ({ webPage, context }) => {
  const mbp = new MainBountyPage(webPage);
  await mbp.showAllBounties.waitFor();
  await mbp.showAllBounties.click();
  await mbp.bountiesPerPage.waitFor();
  await mbp.bountiesPerPage.click();
});

test("display 5 bounties per page", async ({ webPage }) => {
  const mbp = new MainBountyPage(webPage);

  await mbp.fiveBountiesPerPage.waitFor();
  await mbp.fiveBountiesPerPage.click();
  const bountyCount = await mbp.bountyContainer.count();
  expect(bountyCount).toBe(5);
});

test("display 10 bounties per page", async ({ webPage }) => {
  const mbp = new MainBountyPage(webPage);

  await mbp.fiveBountiesPerPage.waitFor();
  await mbp.fiveBountiesPerPage.click();
  const bountyCount = await mbp.bountyContainer.count();
  expect(bountyCount).toBe(5);
});

test("display 15 bounties per page", async ({ webPage }) => {
  const mbp = new MainBountyPage(webPage);

  await mbp.fifteenBountiesPerPage.waitFor();
  await mbp.fifteenBountiesPerPage.click();
  const bountyCount = await mbp.bountyContainer.count();
  expect(bountyCount).toBe(15);
});

test("display 20 bounties per page", async ({ webPage }) => {
  const mbp = new MainBountyPage(webPage);

  await mbp.twentyBountiesPerPage.waitFor();
  await mbp.twentyBountiesPerPage.click();
  const bountyCount = await mbp.bountyContainer.count();
  expect(bountyCount).toBe(20);
});
