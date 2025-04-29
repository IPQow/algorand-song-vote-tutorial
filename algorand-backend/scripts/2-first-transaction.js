import dotenv from "dotenv";
import algosdk from "algosdk";
dotenv.config();

let myaccount = algosdk.mnemonicToSecretKey("quit that then pet indoor pilot caution clump inherit calm away unable region disagree push help build enact ceiling vessel prison spawn ball about wrist");

const baseServer = "https://testnet-api.algonode.cloud"

const algodClient = new algosdk.Algodv2("", baseServer, "");

(async () => {
    try {
        let params = await algodClient.getTransactionParams().do();

        const reciever = "AMF6ZZDTRKBUCAJ36IRVJ5PVEJ6P5GXMDKNO4S54D3A72KHYT3FWRFA5I4";
        const enc = new TextEncoder();
        const note = enc.encode("My first transaction!");
        let amount = 100000;
        let sender = myaccount.addr;

        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender,
            to: reciever,
            amount: amount,
            note: note,
            suggestedParams: params,
        });

        console.log("HERE3");

        let accountInfo = await algodClient.accountInformation(myaccount.addr).do();
        console.log("Account balance: %d microAlgos", accountInfo.amount);

        let signedTxn = txn.signTxn(myaccount.sk);
        let txId = txn.txID().toString();
        console.log("Signed transaction iwth txId: %s", txId);

        await algodClient.sendRawTransaction(signedTxn).do();

        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
        accountInfo = await algodClient.accountInformation(myaccount.addr).do();
        console.log("Transaction amount: %d microAlgos", confirmedTxn.txn.txn.amt);
        console.log("Transaction fee: %d microAlgos", confirmedTxn.txn.txn.fee);
        console.log("Account balance: %d microAlgos", accountInfo.amount);
    } catch (err) {
        console.error("Failed to get apps from the sdk", err)
        process.exit(1);
    }
})();