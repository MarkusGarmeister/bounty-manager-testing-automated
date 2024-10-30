import { Locator, Page } from "@playwright/test";

export class MainBountyPage {
    readonly page: Page;
    readonly connectWallet: Locator;
    readonly polkadotConnect: Locator;
    readonly newBountyButton: Locator;
    readonly bountyManagerLogo: Locator;
    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page
        this.connectWallet = page.getByRole('button', { name: 'Connect Wallet' });
        this.polkadotConnect = page.getByText('Logos/polkadot-js-wallet 2 Polkadot.js Connect Buttons/Back');
        this.newBountyButton = page.getByRole('button', { name: 'NEW BOUNTY' });
        this.bountyManagerLogo = page.getByRole('button', { name: '88D4FD0B-8452-417A-9EEF-' });
        this.cancelButton = page.getByRole('button', { name: 'CANCEL' })
        this.submitButton = page.getByRole('button', { name: 'SUBMIT' })
    }
}