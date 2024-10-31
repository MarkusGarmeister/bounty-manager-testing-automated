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

    constructor(page: Page) {
        this.page = page
        this.bountyTitle = page.getByPlaceholder('Give your Bounty a title');
        this.bountyValue = page.getByPlaceholder('1000')
        this.bountyBond = page.locator('p.value').nth(0)
        this.transactionFees = page.locator('p.value').nth(1)
        this.cancelButton = page.getByRole('button', { name: 'CANCEL' })
        this.submitButton = page.getByRole('button', { name: 'SUBMIT' })
        this.proceedButton = page.getByRole('button', { name: 'PROCEED' })
    }
}