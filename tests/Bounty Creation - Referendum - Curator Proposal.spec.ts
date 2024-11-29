import { test, expect } from '../utils/fixtures.ts';
import { CreateBountyPage } from '../PageObjectModels/CreateBountyPageModel.ts';
import { MainBountyPage } from '../PageObjectModels/MainBountyMangerPageModal.ts';
import { signTransaction } from '../utils/signTransaction.ts';
import { createAndVerifyBounty } from '../utils/createAndVerifyBounty.ts';


import dotenv from 'dotenv'

dotenv.config()

test.describe('Bounty Creation - Referendum - Curator Proposal', () =>{
    let mbp, cbp;
    
    test.beforeEach(async ({ webPage }) =>{
        mbp = new MainBountyPage(webPage)
        cbp = new CreateBountyPage(webPage)
      
        await mbp.newBountyButton.waitFor();
        await mbp.newBountyButton.click();

        await webPage.waitForTimeout(1000);
        await expect(cbp.bountyTitle).toBeVisible();
        await expect(cbp.bountyValue).toBeVisible();
        await expect(cbp.cancelButton).toBeVisible();
        await expect(cbp.submitButton).toBeVisible();
    });
    test.describe('Treasury track', () =>{
        
        test('Verify Small Spender is selected', async ({context, webPage})=> {
            // Enter the bounty title
            await cbp.bountyTitle.type("Test Bounty"); // Types "Test Bounty" into the bounty title input field.

            // Verify that the submit button is disabled
            await expect(cbp.submitButton).toBeDisabled(); // Ensures the submit button is initially disabled.

            // Generate a random number between 1 and 10000
            const randomBountyValue = Math.floor(Math.random() * (10000 - 1 + 1)) + 1; // Generates a random bounty value within the range 1 to 10,000.

            // Type the random bounty value into the input field
            await cbp.bountyValue.type(randomBountyValue.toString()); // Inputs the random bounty value as a string into the bounty value field.

            // Verify that the submit button is enabled
            await expect(cbp.submitButton).toBeEnabled(); // Checks that the submit button is now enabled after entering a valid bounty value.

            // Verify Bounty Bond and Transaction Fee visibility
            await expect(cbp.bountyBond).toBeVisible(); // Asserts that the Bounty Bond section is visible.
            await expect(cbp.transactionFees).toBeVisible(); // Asserts that the Transaction Fee section is visible.

            // Sign the transaction
            await signTransaction(context, cbp.submitButton); // Signs and submits the transaction by interacting with the submit button.
            await webPage.waitForTimeout(3000); // Waits for 1 second to allow the transaction to process.
        
            // Verify transaction success
            const transactionSuccess = webPage.getByText('Transaction', { exact: true }); // Locates the text indicating the transaction was successful.
            await expect(transactionSuccess).toBeVisible(); // Ensures the success message for the transaction is visible.
            await webPage.locator('.fill-white').click(); // Close the transaction success message.

            // Navigate to bounty list and verify creation
            const bountyTitle = webPage.locator('p.text-white', { hasText: 'Test Bounty' }); // Locates the bounty with the title "Test Bounty".
            await expect(bountyTitle).toBeVisible(); // Ensures that the created bounty is visible in the list.

            // Verify success message
            const successMessage = webPage.locator('p', { hasText: 'Test Bounty has been created successfully!' }); // Locates the success message.
            await expect(successMessage).toBeVisible(); // Verifies that the success message is visible on the page.

            // Go to approval section
            await webPage.getByRole('button', { name: 'Approval' }).click(); // Clicks the "Approval" button to proceed to the approval section.
            await webPage.waitForTimeout(1000); // Waits for 1 second to ensure the page has loaded.

            // Verify bounty title and fee details in approval section
            const bountyTitleApproval = webPage.locator('p.text-lg', { hasText: 'Test Bounty' }); // Locates the bounty title in the approval section.
            await expect(bountyTitleApproval).toBeVisible(); // Verifies that the bounty title is visible in the approval section.

            const depositSection = webPage.locator('section:has(p.label:text("Deposit")) p:nth-of-type(2)'); // Locates the "Deposit" field in the approval section.
            await expect(depositSection).toBeVisible(); // Verifies that the "Deposit" field is visible.

            const transactionFee = webPage.locator('section:has(p.label:text("Estimated basic fee")) p:last-of-type'); // Locates the "Transaction Fee" field in the approval section.
            await expect(transactionFee).toBeVisible(); // Verifies that the "Transaction Fee" field is visible.

            // Verify the selected dropdown value
            const dropdownButton = webPage.locator('button#menu-button'); // Locates the dropdown button.
            await expect(dropdownButton).toHaveText(/Small Spender/); // Ensures the dropdown displays "Small Spender" as the selected value.

        });

        test('Verify Medium Spender is selected', async ({context, webPage})=> {
            // Enter the bounty title
            await cbp.bountyTitle.type("Test Bounty"); // Types "Test Bounty" into the bounty title input field.

            // Verify that the submit button is disabled
            await expect(cbp.submitButton).toBeDisabled(); // Ensures the submit button is initially disabled because a bounty value has not been provided.

            // Generate a random number between 10001 and 100000
            const randomBountyValue = Math.floor(Math.random() * (100000 - 10001 + 1)) + 10001; // Generates a random bounty value in the range 10,001 to 100,000 to simulate input variation.

            // Type the random bounty value into the input field
            await cbp.bountyValue.type(randomBountyValue.toString()); // Inputs the generated bounty value into the bounty value field.

            // Verify that the submit button is enabled
            await expect(cbp.submitButton).toBeEnabled(); // Confirms the submit button is now enabled after entering a valid bounty value.
            await webPage.waitForTimeout(1000); // Waits for 1 second to allow the UI to update properly.

            // Verify that the Bounty Bond and Transaction Fee sections are visible
            await expect(cbp.bountyBond).toBeVisible(); // Ensures the "Bounty Bond" section is visible.
            await expect(cbp.transactionFees).toBeVisible(); // Ensures the "Transaction Fee" section is visible.

            // Sign the transaction
            await signTransaction(context, cbp.submitButton); // Simulates signing and submitting the transaction using the submit button.
            await webPage.waitForTimeout(3000); // Waits for 1 second to allow the transaction process to complete.

            // Verify transaction success
            const transactionSuccess = webPage.getByText('Transaction', { exact: true }); // Locates the success message for the transaction by finding the exact "Transaction" text.
            await expect(transactionSuccess).toBeVisible(); // Ensures the transaction success message is visible to the user.
            await webPage.locator('.fill-white').click(); // Close transaction success message.

            // Navigate to bounty list and verify creation
            const bountyTitle = webPage.locator('p.text-white', { hasText: 'Test Bounty' }); // Locates the created bounty with the title "Test Bounty" in the list.
            await expect(bountyTitle).toBeVisible(); // Verifies that the created bounty is visible in the bounty list.

            // Verify success message
            const successMessage = webPage.locator('p', { hasText: 'Test Bounty has been created successfully!' }); // Locates the success message for bounty creation.
            await expect(successMessage).toBeVisible(); // Confirms that the success message is visible on the page.

            // Go to approval section
            await webPage.getByRole('button', { name: 'Approval' }).click(); // Clicks the "Approval" button to navigate to the approval section.
            await webPage.waitForTimeout(1000); // Waits for 1 second to ensure the page is fully loaded.

            // Verify the "Deposit" and "Transaction Fee" sections in the approval screen
            const depositSection = webPage.locator('section:has(p.label:text("Deposit")) p:nth-of-type(2)'); // Locates the "Deposit" section in the approval screen.
            await expect(depositSection).toBeVisible(); // Ensures that the "Deposit" section is visible.

            const transactionFee = webPage.locator('section:has(p.label:text("Estimated basic fee")) p:last-of-type'); // Locates the "Transaction Fee" section in the approval screen.
            await expect(transactionFee).toBeVisible(); // Ensures that the "Transaction Fee" section is visible.

            // Verify the selected dropdown value
            const dropdownButton = webPage.locator('button#menu-button'); // Locates the dropdown button showing the selected spender value.
            await expect(dropdownButton).toHaveText(/Medium Spender/); // Verifies that the dropdown shows "Medium Spender" as the selected value.

        });

        test('Verify Big Spender is selected', async ({context, webPage})=> {
            // Enter the bounty title
            await cbp.bountyTitle.type("Test Bounty"); // Types "Test Bounty" into the bounty title input field.

            // Verify that the submit button is disabled
            await expect(cbp.submitButton).toBeDisabled(); // Ensures the submit button is initially disabled because a bounty value has not been entered.

            // Generate a random number between 100001 and 1000000
            const randomBountyValue = Math.floor(Math.random() * (1000000 - 100001 + 1)) + 100001; // Generates a random bounty value between 100,001 and 1,000,000 to simulate varying user inputs.

            // Type the random bounty value into the input field
            await cbp.bountyValue.type(randomBountyValue.toString()); // Inputs the generated bounty value as a string into the bounty value field.

            // Verify that the submit button is enabled
            await expect(cbp.submitButton).toBeEnabled(); // Confirms that the submit button becomes enabled once a valid bounty value is entered.

            await webPage.waitForTimeout(1000); // Waits for 1 second to allow the page and UI to fully update.

            // Verify that the Bounty Bond and Transaction Fee sections are visible
            await expect(cbp.bountyBond).toBeVisible(); // Checks that the "Bounty Bond" section is displayed.
            await expect(cbp.transactionFees).toBeVisible(); // Checks that the "Transaction Fee" section is displayed.

            // Sign the transaction
            await signTransaction(context, cbp.submitButton); // Simulates signing the transaction by interacting with the submit button.
            await webPage.waitForTimeout(4000); // Waits for 1 second to allow the transaction process to complete.

            // Verify transaction success
            const transactionSuccess = webPage.getByText('Transaction', { exact: true }); // Locates the transaction success message by finding the exact "Transaction" text.
            await expect(transactionSuccess).toBeVisible(); // Ensures that the transaction success message is visible on the page.
            await webPage.locator('.fill-white').click(); // Close transaction success message.

            // Navigate to bounty list and verify creation
            const bountyTitle = webPage.locator('p.text-white', { hasText: 'Test Bounty' }); // Locates the bounty with the title "Test Bounty" in the list.
            await expect(bountyTitle).toBeVisible(); // Confirms that the newly created bounty appears in the bounty list.

            // Verify success message
            const successMessage = webPage.locator('p', { hasText: 'Test Bounty has been created successfully!' }); // Locates the success message for bounty creation.
            await expect(successMessage).toBeVisible(); // Verifies that the success message is displayed on the page.

            // Go to approval section
            await webPage.getByRole('button', { name: 'Approval' }).click(); // Clicks the "Approval" button to navigate to the approval section.
            await webPage.waitForTimeout(1000); // Waits for 1 second to ensure the approval section is fully loaded.

            // Verify the "Deposit" and "Transaction Fee" sections in the approval screen
            const depositSection = webPage.locator('section:has(p.label:text("Deposit")) p:nth-of-type(2)'); // Locates the "Deposit" field in the approval screen.
            await expect(depositSection).toBeVisible(); // Ensures that the "Deposit" field is visible.

            const transactionFee = webPage.locator('section:has(p.label:text("Estimated basic fee")) p:last-of-type'); // Locates the "Transaction Fee" field in the approval screen.
            await expect(transactionFee).toBeVisible(); // Ensures that the "Transaction Fee" field is visible.

            // Verify the selected dropdown value
            const dropdownButton = webPage.locator('button#menu-button'); // Locates the dropdown button displaying the selected spender value.
            await expect(dropdownButton).toHaveText(/Big Spender/); // Verifies that the dropdown displays "Big Spender" as the selected value.

        });
    });

    test.describe('Cancel and Return Home Button', () =>{
        
        test.beforeEach(async ({ context, webPage }) => {
            await createAndVerifyBounty(context, webPage, cbp);
        });

        test('Cancel Button', async ({webPage})=> {
            await cbp.cancelButton.click(); // Clicks the "Cancel" button to abort the current action or form submission.
            await webPage.waitForTimeout(1000); // Waits for 1 second to ensure any redirection or UI update triggered by the cancel action is completed.

            await expect(webPage.getByRole('button', { name: 'NEW BOUNTY' })).toBeVisible(); // Verifies that the "NEW BOUNTY" button is visible, indicating the user has returned to the initial screen or previous state.

        });

        test('Return Home button', async ({context, webPage})=> {
    
            await signTransaction(context, cbp.submitButton); // Simulates signing and submitting the transaction using the submit button.
            await webPage.waitForTimeout(3000); // Waits for 1 second to allow the transaction process to complete and the UI to update.

            // Verify transaction success
            await expect(webPage.getByText('Operation Success')).toBeVisible(); // Ensures the success message "Operation Success" is visible on the page after the transaction is completed.
            await webPage.locator('.fill-white').click(); // Close the success message.

            // Verify that the success screen for bounty approval is displayed
            const bountyApprovalSuccessScreen = webPage.locator('p.text-lg', { hasText: 'Test Bounty' }); // Locates the "Test Bounty" title on the success screen for bounty approval.
            await expect(bountyApprovalSuccessScreen).toBeVisible(); // Ensures the bounty approval success screen is visible.

            // Return to the home screen
            await webPage.getByRole('button', { name: 'RETURN HOME' }).click(); // Clicks the "RETURN HOME" button to navigate back to the home screen.

            // Verify the home screen is displayed
            await expect(webPage.getByRole('button', { name: 'NEW BOUNTY' })).toBeVisible(); // Ensures the "NEW BOUNTY" button is visible, confirming that the user has successfully returned to the home screen.  
        });
    });

    test.describe('Curator Proposal', () =>{
        
        test.beforeEach(async ({ context, webPage }) => {
            await createAndVerifyBounty(context, webPage, cbp);
        });

        test('Curator Proposal', async ({context, webPage})=>{
            await signTransaction(context, cbp.submitButton); // Simulates signing and submitting the transaction using the submit button.
            await webPage.waitForTimeout(3000); // Waits for 1 second to allow the transaction process to complete and the UI to update.

            // Verify transaction success
            await expect(webPage.getByText('Operation Success')).toBeVisible(); // Confirms that the success message "Operation Success" is visible after the transaction is completed.
            await webPage.locator('.fill-white').click(); // Close success message.

            // Verify the bounty approval success screen
            const bountyApprovalSuccessScreen = webPage.locator('p.text-lg', { hasText: 'Test Bounty' }); // Locates the "Test Bounty" title on the success screen for bounty approval.
            await expect(bountyApprovalSuccessScreen).toBeVisible(); // Ensures the bounty approval success screen is displayed.

            // Proceed to the next step
            await cbp.proceedButton.click(); // Clicks the "PROCEED" button to move to the next step.
            await cbp.proceedButton.click(); // Clicks the "PROCEED" button again, assuming a multi-step flow is required.

            // Verify the "Curator Address" step
            await expect(webPage.getByText('Curator Address')).toBeVisible(); // Ensures that the "Curator Address" field is visible on the page, indicating the next step.

            // Enter the Curator Address
            await webPage.getByRole('textbox').first().type('16YDgheHwtmQ9UsmiuZEeVgFzdGF8rnctoEj5NHVTsQonBwe'); // Inputs a sample curator address into the first visible text box.

            // Enter the Curator Fee
            await webPage.getByPlaceholder('0').type('100'); // Inputs the curator fee value ("100") into the field with a placeholder of "0".

            // Sign the transaction for curator details
            await signTransaction(context, cbp.submitButton); // Signs and submits the transaction with the curator details.
            await webPage.waitForTimeout(1000); // Waits for 1 second to ensure the transaction completes and the UI updates.

            // Verify transaction success again
            await expect(webPage.getByText('Operation Success')).toBeVisible(); // Confirms the success message "Operation Success" is displayed for the curator transaction.

            // Navigate to the next screen
            await webPage.locator('.fill-white').click(); // Clicks an element (e.g., a navigation button) to proceed further.

            // Verify the Referendum for Curator screen
            await expect(webPage.getByText('The Referendum for Curator')).toBeVisible(); // Confirms that the "Referendum for Curator" screen is displayed.

            // Return to the home screen
            await webPage.getByRole('button', { name: 'RETURN HOME' }).click(); // Clicks the "RETURN HOME" button to navigate back to the home screen.

            // Verify the home screen is displayed
            await expect(webPage.getByRole('button', { name: 'NEW BOUNTY' })).toBeVisible(); // Confirms that the "NEW BOUNTY" button is visible, indicating a successful return to the home screen.

        });
    });
});

