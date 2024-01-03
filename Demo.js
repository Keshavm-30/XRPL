import xrpl from 'xrpl';

async function configureAccount( defaultRippleSetting){
  console.log(defaultRippleSetting);
  let settings_tx;
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233" );
  await client.connect();
  const my_wallet = xrpl.Wallet.fromSeed("sEd7ioSXVxxqm2Qr3GSLLWmTuw2Rmyw");
  console.log(my_wallet.address);

  if(defaultRippleSetting){
    console.log("here");
    settings_tx = {
      "TransactionType":"AccountSet",
      "Account": my_wallet.address,
      "SetFlag" : xrpl.AccountSetAsfFlags.asfDefaultRipple
    }
  }else{
    console.log("or Here");
    settings_tx = {
      "TransactionType":"AccountSet",
      "Account": my_wallet.address,
      "ClearFlag" : xrpl.AccountSetAsfFlags.asfDefaultRipple
    }
  }

  const prepared = await client.autofill(settings_tx);
  const signed = my_wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  if(result.result.meta.TransactionResult == 'tesSUCCESS'){
    console.log("Sucess");
  }else{
    console.log("Fail");
  }
  await client.disconnect();

}

async function createTrustLine(){
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233" );
  await client.connect();

  const standBy_wallet = xrpl.Wallet.fromSeed("sEd7ioSXVxxqm2Qr3GSLLWmTuw2Rmyw");
  const operational_wallet = xrpl.Wallet.fromSeed("sEd7zrFLu2o2X4k74kk4cLCi2gqgaBs");

  const trustSet_tx = {
    "TransactionType" : "TrustSet",
    "Account": operational_wallet.address,
    "LimitAmount":{
      "currency": "INR",
      "issuer" : standBy_wallet.address,
      "value": 500
    }
  }

  const prepared = await client.autofill(trustSet_tx);
  const signed = operational_wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  if(result.result.meta.TransactionResult=='tesSUCCESS'){
    console.log("sucess", result);
  }else{
    console.log("Failed");
  }

  await client.disconnect();
}
createTrustLine();