import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

let api: ApiPromise;
// creates the api for the blockhain
export async function initApi() {
  console.log("start init ", api);
  const provider = new WsProvider("ws://localhost:8000/");
  api = await ApiPromise.create({ provider });
  console.log("finished init", api.clone);
}

async function currentBlock() {
  const currentHeader = await api.rpc.chain.getHeader();
  const currentBlock: number = currentHeader.number.toNumber();

  return currentBlock;
}
// returns the latest bounty ID
export async function getLatestBountyId() {
  const referendaCount = await api.query.bounties.bountyCount();

  const referendaCountString = referendaCount?.toString();
  const referendaCountNumber = Number(referendaCountString?.replace(",", ""));
  const latestReferenda = referendaCountNumber - 1;

  return latestReferenda;
}
// returns the latest referenda ID, with this you can identify the last action on the blockchain
export async function getLatestReferendaId() {
  const referendaCount = (
    await api.query.referenda.referendumCount()
  ).toHuman();

  const referendaCountString = referendaCount?.toString();
  const referendaCountNumber = Number(referendaCountString?.replace(",", ""));
  const latestReferenda = referendaCountNumber - 1;
  console.log(latestReferenda);

  return latestReferenda;
}

// places the Decision Deposite and needs to be done after creating a bounty or proposing a curator
export async function placeDecisionDeposit() {
  const keyring = new Keyring({ type: "sr25519" });
  const sender = keyring.addFromMnemonic(
    "grace world memory render hub effort wisdom thumb panther cause trophy fuel"
  );
  // const sender = keyring.addFromUri("//Alice");
  const referendaCount = (
    await api.query.referenda.referendumCount()
  ).toHuman();
  console.log(referendaCount);
  const referendaCountString = referendaCount?.toString();
  const referendaCountNumber = Number(referendaCountString?.replace(",", ""));
  const index = referendaCountNumber - 1;
  try {
    const unsub = await api.tx.referenda
      .placeDecisionDeposit(index)
      .signAndSend(sender, (result) => {
        console.log(`Transaction status: ${result.status}`);
        console.log(sender.address);

        if (result.status.isInBlock || result.status.isFinalized) {
          console.log("Transaction included in block");
          unsub(); // Unsubscribe after completion
        }
      });
  } catch (error) {
    console.error("Error placing decision deposit:", error);
  }
}

// forwards the blockchain by hour , argument b is optional and can be used to subtract single blocks
export async function forwardInHours(n: number, b: number = 0) {
  const hoursInBlocks = (n * 60 * 60) / 6 - b;
  let currentHeader = await api.rpc.chain.getHeader();
  let currentBlockNumber = currentHeader.number.toNumber();
  const blockHash = await api.rpc.chain.getBlockHash(currentBlockNumber);
  const newBlock = await api.rpc("dev_newBlock", {
    count: 1,
    unsafeBlockHeight: currentBlockNumber + hoursInBlocks,
  });
}
// forwards the blockchain by days , argument b is optional and can be used to subtract single blocks
export async function forwardInDays(n: number, b: number = 0) {
  const daysInBlock = (n * 24 * 60 * 60) / 6 - b;
  let currentHeader = await api.rpc.chain.getHeader();
  let currentBlockNumber = currentHeader.number.toNumber();
  const blockHash = await api.rpc.chain.getBlockHash(currentBlockNumber);
  const newBlock = await api.rpc("dev_newBlock", {
    count: 1,
    unsafeBlockHeight: currentBlockNumber + daysInBlock,
  });
}

// forwards the blockchain by blocks
export async function forwardInBlocks(n: number) {
  const blocks = n;
  let currentHeader = await api.rpc.chain.getHeader();
  let currentBlockNumber = currentHeader.number.toNumber();
  const blockHash = await api.rpc.chain.getBlockHash(currentBlockNumber);
  const newBlock = await api.rpc("dev_newBlock", {
    count: 1,
    unsafeBlockHeight: currentBlockNumber + blocks,
  });
}

export async function getFundingPeriod() {
  const completeFundingPeriod = 20390400; // at this block the funding periode is 24 days
  let currentHeader = await api.rpc.chain.getHeader();
  let currentBlockNumber = currentHeader.number.toNumber();
  const diffCurrentBlock = Math.abs(currentBlockNumber - completeFundingPeriod);
  const oneFundingPeriodInBlocks = (24 * 24 * 60 * 60) / 6;
  const currentFundingPeriode =
    oneFundingPeriodInBlocks - (diffCurrentBlock % oneFundingPeriodInBlocks);
  console.log(
    diffCurrentBlock,
    oneFundingPeriodInBlocks,
    currentFundingPeriode
  );
  return currentFundingPeriode;
}
