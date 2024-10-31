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

async function getLatestReferendaId() {
  const referendaCount = (
    await api.query.referenda.referendumCount()
  ).toHuman();

  const referendaCountString = referendaCount?.toString();
  const referendaCountNumber = Number(referendaCountString?.replace(",", ""));
  const latestReferenda = referendaCountNumber - 1;

  return latestReferenda;
}
export async function getDeciding() {
  const fourHoursInBlock = (4 * 60 * 60) / 6;
  let currentHeader = await api.rpc.chain.getHeader();
  let currentBlockNumber = currentHeader.number.toNumber();
  const blockHash = await api.rpc.chain.getBlockHash(currentBlockNumber);
  const newBlock = await api.rpc("dev_newBlock", {
    count: 1,
    unsafeBlockHeight: currentBlockNumber + fourHoursInBlock,
  });
}

export async function placeDecisionDeposit() {
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
      .signAndSend(sender);
  } catch (error) {
    console.error("Error placing decision deposit:", error);
  }
}
