import { Locator, Page } from "@playwright/test";

export class MainBountyPage {
  readonly page: Page;
  readonly connectWallet: Locator;
  readonly polkadotConnect: Locator;
  readonly newBountyButton: Locator;
  readonly bountyManagerLogo: Locator;
  readonly showAllBounties: Locator;
  readonly showALLOptions: Locator;
  readonly bountyHeader: Locator;
  readonly bountyStatus: Locator;
  readonly curatorPropsalButton: Locator;
  readonly acceptCuratorRole: Locator;
  readonly extendBounty: Locator;
  readonly bountyContainer: Locator;
  readonly bountiesPerPage: Locator;
  readonly tenBountiesPerPage: Locator;
  readonly fiveBountiesPerPage: Locator;
  readonly fifteenBountiesPerPage: Locator;
  readonly twentyBountiesPerPage: Locator;
  readonly menu: Locator;
  readonly logoutButton: Locator;
  readonly curatorAddress: Locator;
  readonly bountyCreatorAddress: Locator;
  readonly noCuratorAddress: Locator;
  readonly addChildBountyButton: Locator;
  readonly assignChildBountyButton: Locator;
  readonly acceptSubCuratorButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.connectWallet = page.getByRole("button", { name: "Connect Wallet" });
    this.polkadotConnect = page.getByRole("button", {
      name: "Logo Polkadot.js Connect",
    });
    this.newBountyButton = page.getByRole("link", { name: "NEW BOUNTY" });
    this.bountyManagerLogo = page.getByRole("link", {
      name: "Logo Bounty Manager",
    });
    this.showAllBounties = page.getByLabel("all bounties");
    this.showALLOptions = page.getByLabel("all options");
    this.bountyHeader = page.locator("span.text-xl.lg\\:text-2xl");
    this.bountyStatus = page.locator("section > p:nth-child(2)");
    this.curatorPropsalButton = page.getByRole("link", { name: "PROPOSE" });
    this.acceptCuratorRole = page.getByRole("button", { name: "ACCEPT" });
    this.bountyContainer = page.locator(
      'div[data-pagination-scroll^="bounty-"]'
    );

    this.extendBounty = page.getByRole("button", { name: "EXTEND" });
    this.bountiesPerPage = page.locator('#menu-button[aria-expanded="true"]');
    this.tenBountiesPerPage = page.getByRole("menuitem", {
      name: "10",
      exact: true,
    });
    this.fiveBountiesPerPage = page.getByRole("menuitem", {
      name: "5",
      exact: true,
    });
    this.fifteenBountiesPerPage = page.getByRole("menuitem", {
      name: "15",
      exact: true,
    });
    this.twentyBountiesPerPage = page.getByRole("menuitem", {
      name: "5",
      exact: true,
    });
    this.menu = page.getByRole("button", { name: "menu" });
    this.logoutButton = page.getByRole('button', { name: 'Log out logout' });
    this.curatorAddress = page.getByRole('button', { name: 'Curator 15mLgX2Xy9W2MkvSYi3r' });
    this.bountyCreatorAddress = page.getByRole('button', { name: 'Bounty Creator' });
    this.noCuratorAddress = page.getByRole('button', { name: 'No Curator' });
    this.addChildBountyButton = page.getByRole('button', { name: 'ADD' });
    this.assignChildBountyButton = page.getByRole('button', { name: 'ASSIGN' });
    this.acceptCuratorRole = page.getByRole('button', { name: 'ACCEPT' });
    this.acceptSubCuratorButton = page.getByRole('button', { name: 'ACCEPT' });
  }
}
