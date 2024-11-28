import { test, expect } from '../utils/fixtures.ts';
import { signTransaction } from '../utils/signTransaction.ts';



export async function createAndVerifyBounty(context, webPage, cbp) {
    // Enter the bounty title
    await cbp.bountyTitle.type("Test Bounty"); // Types "Test Bounty" into the bounty title field.

    // Verify that the submit button is disabled
    await expect(cbp.submitButton).toBeDisabled(); // Ensures that the submit button remains disabled until a valid bounty value is entered.

    // Generate a random number between 1 and 10000
    const randomBountyValue = Math.floor(Math.random() * (10000 - 1 + 1)) + 1; // Creates a random bounty value in the range 1 to 10,000 to simulate variability in input.

    // Type the random bounty value into the input field
    await cbp.bountyValue.type(randomBountyValue.toString()); // Inputs the generated bounty value into the bounty value field.

    // Verify that the submit button is enabled
    await expect(cbp.submitButton).toBeEnabled(); // Confirms that the submit button becomes enabled after entering a valid bounty value.

    // Verify Bounty Bond and Transaction Fee visibility
    await expect(cbp.bountyBond).toBeVisible(); // Checks that the "Bounty Bond" section is displayed.
    await expect(cbp.transactionFees).toBeVisible(); // Checks that the "Transaction Fee" section is displayed.

    // Sign the transaction
    await signTransaction(context, cbp.submitButton); // Simulates signing the transaction by interacting with the submit button.
    await webPage.waitForTimeout(3000); // Introduces a 2-second delay to allow the transaction process to complete.

    // Verify transaction success
    const transactionSuccess = webPage.getByText('Transaction', { exact: true }); // Finds the element displaying the "Transaction" success text.
    await expect(transactionSuccess).toBeVisible(); // Ensures the transaction success message is visible to the user.
    await webPage.locator('.fill-white').click(); // Close the transaction success message

    // Navigate to bounty list and verify creation
    const bountyTitle = webPage.locator('p.text-white', { hasText: 'Test Bounty' }); // Locates the bounty with the title "Test Bounty" in the list.
    await expect(bountyTitle).toBeVisible(); // Confirms that the newly created bounty appears in the bounty list.

    // Verify success message
    const successMessage = webPage.locator('p', { hasText: 'Test Bounty has been created successfully!' }); // Locates the success message for bounty creation.
    await expect(successMessage).toBeVisible(); // Verifies that the success message is displayed on the page.

    // Go to approval section
    await webPage.getByRole('button', { name: 'Approval' }).click(); // Clicks the "Approval" button to proceed to the approval section.
    await webPage.waitForTimeout(1000); // Waits for 1 second to ensure the approval section is fully loaded.

    // Verify bounty title and fee details in approval section
    const bountyTitleApproval = webPage.locator('p.text-lg', { hasText: 'Test Bounty' }); // Locates the bounty title in the approval section.
    await expect(bountyTitleApproval).toBeVisible(); // Confirms that the bounty title is visible in the approval section.

    const depositSection = webPage.locator('section:has(p.label:text("Deposit")) p:nth-of-type(2)'); // Locates the "Deposit" field in the approval section.
    await expect(depositSection).toBeVisible(); // Ensures that the "Deposit" field is visible.

    const transactionFee = webPage.locator('section:has(p.label:text("Estimated basic fee")) p:last-of-type'); // Locates the "Transaction Fee" field in the approval section.
    await expect(transactionFee).toBeVisible(); // Ensures that the "Transaction Fee" field is visible.
}
