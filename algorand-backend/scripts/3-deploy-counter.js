import dotenv from "dotenv";
import algosdk from "algosdk"
import { open, readFile } from "node:fs/promises";
dotenv.config();

const baseServer = "https://testnet-api.algonode.cloud";

const algodClient = new algosdk.Algodv2("", baseServer, "");

let myaccount = algosdk.mnemonicToSecretKey("quit that then pet indoor pilot caution clump inherit calm away unable region disagree push help build enact ceiling vessel prison spawn ball about wrist");

let sender = myaccount.addr;

async function compileProgram(client, TealSource) {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(TealSource);
    let compileResponse = await client.compile(programBytes).do();
    let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
    return compiledBytes;
}

(async () => {
    try {
        const localInts = 0
        const localBytes = 0
        const globalInts = 1
        const globalBytes = 0

        let approvalProgramfile = await open('./contracts/artifacts/counter_approval.teal');
        let clearProgramfile = await open('./contracts/artifacts/counter_clear.teal');

        const approvalProgram = await approvalProgramfile.readFile();
        const clearProgram = await clearProgramfile.readFile();

        const approvalProgramBinary = await compileProgram(algodClient, approvalProgram);
        const clearPgoramBinary = await compileProgram(algodClient, clearProgram);

        let params = await algodClient.getTransactionParams().do();
        const onComplete = algosdk.OnApplicationComplete.NoOpOC;

        console.log("Deploying Application");

        let txn = algosdk.makeApplicationCreateTxn(sender, params, onComplete, approvalProgramBinary, clearPgoramBinary, localInts, localBytes, globalInts, globalBytes,);
        let txId = txn.txID().toString();

        let signedTxn = txn.signTxn(myaccount.sk);
        console.log("signed transaction with txID: %s, txId");

        await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 2);

        let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
        let appId = transactionResponse['application-index'];
        console.log("Created new app with app-id: ", appId);
    } catch (err) {
        console.error("Failed to deploy: ", err);
        process.exit(1);
    }
})()