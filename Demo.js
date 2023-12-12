const xrpl = require("xrpl");


async function GetAccount(){
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233"); // RPC URL For Testnet
    await client.connect();
 
    // Create a wallet and fund it with the TestNet Faucet
    const fund_result = await client.fundWallet();
    const test_wallet = fund_result.wallet
    console.log("Created Wallet ",test_wallet);
    console.log("Funds in the Created Wallet",fund_result);

    await client.disconnect();
}

async function GenerateAccount() {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const test_wallet = xrpl.Wallet.generate();
    console.log(test_wallet);

    await client.disconnect();
}


// If you already have seed encoded you can make a wallet Instance
async function GetAccountFronSeed(){
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();
    const test_wallet = xrpl.Wallet.fromSeed("sEdTLrJ9ou8qvDTRCv2ybofMA4Qm7eq");
    console.log(test_wallet);
    await client.disconnect();
}


async function GetAccountInfo(){
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();
    // const test_wallet = xrpl.Wallet.fromSeed("sEdTLrJ9ou8qvDTRCv2ybofMA4Qm7eq");
    const test_wallet = xrpl.Wallet.generate()
    const response = await client.request({
        "command": "account_info",
        "account": "r9HbWBS6ojWxyjvdqogN9GU4TpPBn8h4RV", // Classic Address 
        "ledger_index": "validated"
      });
    console.log(response);

    // Listen to ledger close events
  client.request({
    "command": "subscribe",
    "streams": ["ledger"]
  })
  client.on("ledgerClosed", async (ledger) => {
    console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
  })
    await client.disconnect();
}

GetAccountInfo();
// GetAccount();
