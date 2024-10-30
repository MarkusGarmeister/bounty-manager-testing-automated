import { test, expect } from '../utils/fixtures';
import { CreateBountyPage } from '../PageObjectModels/CreateBountyPageModel.ts';
import { MainBountyPage } from '../PageObjectModels/MainBountyMangerPageModal.ts';
import { signTransaction } from '../utils/signTransaction';

import dotenv from 'dotenv'

dotenv.config()



test('Check the Bounty Bond', async ({ webPage, context }) =>{
  const mbp = new MainBountyPage(webPage)
  const cbp = new CreateBountyPage(webPage)

  await mbp.newBountyButton.waitFor()
  await mbp.newBountyButton.click()
  
  await cbp.bountyTitle.type("Test Bounty")
  await cbp.bountyValue.type("12345")

  await webPage.waitForTimeout(1000)

  
  await expect(cbp.bountyBond).toHaveText("1.11 DOT")
  
  await signTransaction(context, cbp.submitButton)
  // const walletPromise = context.waitForEvent('page')
  // await cbp.submitButton.click()
  // const walletPage = await walletPromise
  
  // await walletPage.getByRole('textbox').type(process.env.POLKADOT_WALLET_PASSWORD)
  // await walletPage.getByRole('button', { name: 'Sign the transaction' }).click()
  const transactionSuccess = webPage.getByText('Operation Success')


})
