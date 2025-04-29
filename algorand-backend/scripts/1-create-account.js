import algosdk from "algosdk";

const myaccount = algosdk.generateAccount();
console.log("Account created. Save address and Mneumonic");
console.log("Account address = " + myaccount.addr);
let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
console.log("Account Mnemonic = " + account_mnemonic);