import { ApiPromise, WsProvider } from "@polkadot/api";
import { firstValueFrom } from 'rxjs'

async function main() {
    const provider = new WsProvider('ws://localhost:8000/');
    const api = await ApiPromise.create({ provider });

    console.log("API is ready!");
    // Query example
    const testNumber = (await api.rpc.chain.getHeader())
    const number = testNumber.number.toNumber()
    const epochConfig = await api.query.babe.epochStart();
    //const number = (await firstValueFrom(api.rpc.chain.getHeader())).number.toNumber()
    console.log("Epoch config:", epochConfig.toHuman());
    console.log(testNumber.toHuman())
    console.log(number)
}

async function fastForward(blocks: number) {
    const provider = new WsProvider('ws://localhost:8000/');
    const api = await ApiPromise.create({ provider });

    let number = (await firstValueFrom(api.rpc.chain.getHeader())).number.toNumber();
    await firstValueFrom(
        api.rpc('dev_newBlock', {
            count: 1,
            unsafeBlockHeight: number + blocks
        })
    );
}

main().catch(console.error);