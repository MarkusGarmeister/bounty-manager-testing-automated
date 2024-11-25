import { KeyringPair } from "@kiltprotocol/sdk-js";
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
export async function getLatestBountyId() {
  const referendaCount = await api.query.bounties.bountyCount();

  const referendaCountString = referendaCount?.toString();
  const referendaCountNumber = Number(referendaCountString?.replace(",", ""));
  const latestReferenda = referendaCountNumber - 1;

  return latestReferenda;
}

export async function getLatestReferendaId() {
  const referendaCount = (
    await api.query.referenda.referendumCount()
  ).toHuman();

  const referendaCountString = referendaCount?.toString();
  const referendaCountNumber = Number(referendaCountString?.replace(",", ""));
  const latestReferenda = referendaCountNumber - 1;

  return latestReferenda;
}

export async function placeDecisionDeposit() {
  console.log("I start deposite");
  const keyring = new Keyring({ type: "sr25519" });
  const sender = keyring.addFromMnemonic(
    "grace world memory render hub effort wisdom thumb panther cause trophy fuel"
  );
  const referendaCount = (
    await api.query.referenda.referendumCount()
  ).toHuman();

  const referendaCountString = referendaCount?.toString();
  const referendaCountNumber = Number(referendaCountString?.replace(",", ""));
  const index = referendaCountNumber - 1;
  try {
    const unsub = await api.tx.referenda
      .placeDecisionDeposit(index)
      .signAndSend(sender, (result) => {
        console.log(`Transaction status: ${result.status}`);
        if (result.status.isInBlock || result.status.isFinalized) {
          console.log("Transaction included in block");
          unsub(); // Unsubscribe after completion
        }
      });
  } catch (error) {
    console.error("Error placing decision deposit:", error);
  }
}

export async function acceptCurator() {
  const keyring = new Keyring({ type: "sr25519" });
  const sender = keyring.addFromMnemonic(
    "grace world memory render hub effort wisdom thumb panther cause trophy fuel"
  );
  try {
    // Fetch the current bounty count
    const bountyId = await api.query.bounties.bountyCount();

    // Submit a transaction to accept the curator for the bounty
    const txHash = await api.tx.bounties
      .acceptCurator(bountyId)
      .signAndSend(sender, (result) => {
        console.log(`Transaction status: ${result.status}`);
        if (result.status.isInBlock || result.status.isFinalized) {
          console.log("Transaction included in block");
        }
      });

    console.log(
      `Curator accepted for bounty ID: ${bountyId}. Transaction Hash: ${txHash}`
    );
  } catch (error) {
    console.error("Error accepting curator:", error);
  }
}

export async function forwardInHours(n: number, b: number = 0) {
  const fourHoursInBlock = (n * 60 * 60) / 6 - b;
  let currentHeader = await api.rpc.chain.getHeader();
  let currentBlockNumber = currentHeader.number.toNumber();
  const blockHash = await api.rpc.chain.getBlockHash(currentBlockNumber);
  const newBlock = await api.rpc("dev_newBlock", {
    count: 1,
    unsafeBlockHeight: currentBlockNumber + fourHoursInBlock,
  });
}

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
