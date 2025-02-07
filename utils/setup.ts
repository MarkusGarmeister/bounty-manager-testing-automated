import { chromium } from '@playwright/test';
import path from 'path';

const EXTENSION_PATH = "/Users/hendrizeneli/Documents/Test-Projekte/Polkadot/fresh-clone/utils/PolkadotWallet";

export default async function globalSetup() {
    const context = await chromium.launchPersistentContext('', {
        headless: false,
        args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`,
            "--disable-blink-features=AutomationControlled" // Kjo ndihmon për të shmangur bllokimet e extension-it
        ],
    });

    console.log("✅ Shfletuesi me extension u hap me sukses!");
    await context.close();
}
