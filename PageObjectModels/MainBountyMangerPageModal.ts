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

  constructor(page: Page) {
    this.page = page;
    this.connectWallet = page.getByRole("button", { name: "Connect Wallet" });
    this.polkadotConnect = page.getByText(
      "Logos/polkadot-js-wallet 2 Polkadot.js Connect Buttons/Back"
    );
    this.newBountyButton = page.getByRole("link", { name: "NEW BOUNTY" });
    this.bountyManagerLogo = page.getByRole("link", { name: "Logo" });
    this.showAllBounties = page.getByLabel("all bounties");
    this.showALLOptions = page.getByLabel("all options");
    this.bountyHeader = page.locator("span.text-xl.lg\\:text-2xl");
    this.bountyStatus = page.locator("section > p:nth-child(2)");
    this.curatorPropsalButton = page.getByRole("button", { name: "PROPOSE" });
    this.acceptCuratorRole = page.getByRole("button", { name: "ACCEPT" });
    this.extendBounty = page.getByRole("button", { name: "EXTEND" });
  }
}
