import { Locator, Page } from "@playwright/test";

export class CreateBountyPage {
  readonly page: Page;
  readonly bountyTitle: Locator;
  readonly bountyValue: Locator;
  readonly bountyBond: Locator;
  readonly transactionFees: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;
  readonly proceedButton: Locator;
  readonly curatorAddress: Locator;
  readonly curatorFee: Locator;
  readonly treasuryTrack: Locator;
  readonly spendersDropdown: Locator;
  readonly creationTab: Locator;
  readonly approvalTab: Locator;
  readonly approvalDeposit: Locator;
  readonly approvalTransactionFees: Locator;
  readonly firstBounty: Locator;
  readonly transactionFeeDropdownArrow: Locator;
  readonly actualFeeLocator: Locator;
  readonly firstBountyHeader: Locator;



  constructor(page: Page) {
    this.page = page;
    this.bountyTitle = page.getByPlaceholder("Give your Bounty a title");
    this.bountyValue = page.getByPlaceholder("1000");
    this.bountyBond = page.locator("p.value").nth(0);
    this.transactionFees = page.locator("p.value").nth(1);
    this.cancelButton = page.getByRole("link", { name: "CANCEL" });
    this.submitButton = page.getByRole("button", { name: "SUBMIT" });
    this.proceedButton = page.getByRole("link", { name: "PROCEED" });
    this.curatorAddress = page.getByRole("textbox").first();
    this.curatorFee = page.getByPlaceholder("0");
    this.treasuryTrack = page.locator('#menu-button');
    this.spendersDropdown = page.locator("button#menu-button");
    this.creationTab = page.getByRole('link', { name: 'Creation' });
    this.approvalTab = page.getByRole('link', { name: 'Approval' });
    this.approvalDeposit = page.locator('section.space-y-1:has(p.label:text("Deposit")) p:not(.label)');
    this.approvalTransactionFees = page.locator('section.space-y-1:has(p.label:text("Estimated basic fee")) p:not(.label)');
    this.firstBounty = page.locator('tbody.ui--Table-Body tr').first();
    this.transactionFeeDropdownArrow = page.locator('.ui--Expander-summary.isLeft svg[data-testid="caret-down"] path');
    this.actualFeeLocator = page.locator('.ui--Labelled-content input[disabled]');
    this.firstBountyHeader = page.locator('.text-white .flex.justify-between .flex.flex-col.lg\\:flex-row.lg\\:justify-start span.text-xl').first();
  }
}

// await page.locator('button:has-text("Small Spender")');
// await page.locator('button:has-text("Medium Spender")');
// await page.locator('button:has-text("Big Spender")');
