import xrpl from 'xrpl';

async function SendXRP(){
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233"); // RPC URL For Testnet
    await client.connect();
 
    // Create a wallet and fund it with the TestNet Faucet
    const fund_result = await client.fundWallet();
    const test_wallet = fund_result.wallet
    console.log("Created Wallet ",test_wallet);
    console.log("Funds in the Created Wallet",fund_result);

    await client.disconnect();
}

async function sendXRP() {    
  // results  = "Connecting to the selected ledger.\n"
  // standbyResultField.value = results
  // let net = getNet()
  // results = 'Connecting to ' + getNet() + '....'
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  await client.connect()
      
  // results  += "\nConnected. Sending XRP.\n"
  // standbyResultField.value = results
      
  const standby_wallet = xrpl.Wallet.fromSeed("sEdVX1izJZ4aTaGVurpua9qwtuQdNir") // seed : sEdVX1izJZ4aTaGVurpua9qwtuQdNir , classicAddress : raqZfTCuv6GYg8kddG3wve5AgFqfAtFTRw
  const operational_wallet = xrpl.Wallet.fromSeed("sEdVry1zQAZqLdxrTtaym212JufYaqc") // seed : sEdVry1zQAZqLdxrTtaym212JufYaqc , classicAddress : r446j7kWjBsdpYoCWvyqmz1SitkFfJzwFX
  // const sendAmount = standbyAmountField.value

  console.log("standbyWallet",standby_wallet.address)
  console.log("OperationalWallet",operational_wallet.address)
  console.log("TypeOfOperationalWallet.address",typeof(operational_wallet.address));
        
  // results += "\nstandby_wallet.address: = " + standby_wallet.address
  // standbyResultField.value = results
      
// -------------------------------------------------------- Prepare transaction
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": "raqZfTCuv6GYg8kddG3wve5AgFqfAtFTRw",
    "Amount": xrpl.xrpToDrops(100),
    "Destination": "r446j7kWjBsdpYoCWvyqmz1SitkFfJzwFX"
  })
      
// ------------------------------------------------- Sign prepared instructions
  const signed = standby_wallet.sign(prepared)
  
// -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
      
  // results  += "\nBalance changes: " + 
  //   JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  // standbyResultField.value = results

  // standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
  // operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))      
  
  const standByWalletBalance=  (await client.getXrpBalance(standby_wallet.address))
  const operationalWalletBalance = (await client.getXrpBalance(operational_wallet.address)) 
  console.log("standByWalletBalance",standByWalletBalance,"operatiionalWalletBalance",operationalWalletBalance);
  client.disconnect()      
} // End of sendXRP()
   
sendXRP()