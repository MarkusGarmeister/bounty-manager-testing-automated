import { Locator, Page } from "@playwright/test";
import dotenv from 'dotenv';

dotenv.config()

export class PolkadotWalletExtension {
    readonly page: Page;
    readonly inputPassword: Locator;
    readonly signTransactionButton: Locator;


    constructor(page: Page) {
        this.page = page 
        this.inputPassword = page.getByRole('textbox')
        this.signTransactionButton = page.getByRole('button', { name: 'Sign the transaction' })
        
    }

    async signTransaction(context, trigger) {
        const walletPromise = context.waitForEvent('page')
        await trigger
        await this.inputPassword.type(process.env.POLKADOT_WALLET_PASSWORD)
        await this.signTransactionButton.click()

    }
}


