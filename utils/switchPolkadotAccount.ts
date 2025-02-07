export async function switchPolkadotAccount(page, walletDetails) {
    const extensionId = "mopnmbcafieddcagagdcbnhejhlodfdd";
    const extensionUrl = `chrome-extension://${extensionId}/index.html`;

    // ✅ 1. Hap një tab të ri për extension-in
    const extensionPage = await page.context().newPage();
    await extensionPage.goto(extensionUrl, { waitUntil: "load" });

    console.log("✅ Extension-i u hap me sukses në Playwright!");

    // ✅ 2. Sigurohu që extension-i është i ngarkuar
    await extensionPage.waitForLoadState("domcontentloaded");
    await extensionPage.bringToFront();

    // ✅ 3. Kliko në butonin "Understood, let me continue"
    await extensionPage.locator('button:has-text("Understood, let me continue")').click();

    // ✅ 4. Hap menunë e llogarive dhe importo një të re
    await extensionPage.locator("svg").first().click();
    await extensionPage.getByRole("link", { name: "Import account from pre-" }).click();
    await extensionPage.locator("textarea").fill(walletDetails.secretKey);
    await extensionPage.locator('button:has-text("Next")').click();

    // ✅ 5. Plotëso fushat e hyrjes
    const descriptiveNameField = extensionPage.locator("input").nth(0);
    const passwordField = extensionPage.locator('input[type="password"]').nth(0);
    const repeatPasswordField = extensionPage.locator('input[type="password"]').nth(1);

    await descriptiveNameField.type(walletDetails.descriptiveName);
    await passwordField.fill(walletDetails.password);
    await repeatPasswordField.fill(walletDetails.password);

    // ✅ 6. Kliko për të shtuar llogarinë e re
    await extensionPage.locator('button:has-text("Add the account with the supplied seed")').click();
    console.log(`✅ Llogaria "${walletDetails.descriptiveName}" u shtua me sukses!`);
}
