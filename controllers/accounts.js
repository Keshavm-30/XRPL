
import xrpl from 'xrpl';
import { RESPONSES,RES_MSG } from '../common/response.js';
import * as dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();


export async function CreateAccountWithFunds(req, res){

    try{
        console.log("GitChanges");
        const rpc_url_testnet = process.env.RPC_URL_TESTNET;
        const client = new xrpl.Client(rpc_url_testnet);
        console.time('client.connect');
        await client.connect();
        console.timeEnd('client.connect');

    // const test_wallet = xrpl.Wallet.generate();
    console.time('client.fundWallet');
    const fund_result = await client.fundWallet();
    console.timeEnd('client.fundWallet');
  // const testWalletBalance = await client.getXrpBalance(test_wallet.classicAddress);

    const test_wallet = fund_result.wallet
    await client.disconnect();
    return res.status(RESPONSES.SUCCESS).send({
      status : RESPONSES.SUCCESS,
      message : RES_MSG.DATA_CREATED,
      data :{
      public_key : test_wallet.publicKey,    
      private_key : test_wallet.privateKey,
      classic_address : test_wallet.classicAddress,
      seed : test_wallet.seed,
      // balanceOf : testWalletBalance
      }
    })


    }catch(error){
        return res.status(RESPONSES.INTERNALSERVER).send({
            status : RESPONSES.INTERNALSERVER,
            message : RES_MSG.INTERNAL_SERVER_ERROR,
            error: true
        })

    }    

}

export async function GetAccountFromSeed(req, res){
    try{
        const rpc_url_testnet = process.env.RPC_URL_TESTNET;
        const seed = req.params.seed;
        const client = new xrpl.Client(rpc_url_testnet);
        await client.connect();
        const test_wallet = xrpl.Wallet.fromSeed(seed);
        await client.disconnect();
         return res.status(RESPONSES.SUCCESS).send({
            status : RESPONSES.SUCCESS,
            message : RES_MSG.DATA_FOUND,
            data :{
            public_key : test_wallet.publicKey,
            classic_address : test_wallet.classicAddress,
            private_key : test_wallet.privateKey,
            }
         })

    }catch(error){
        return res.status(RESPONSES.INTERNALSERVER).send({
            status : RESPONSES.INTERNALSERVER,
            message : RES_MSG.INTERNAL_SERVER_ERROR,
            error: true
        })
    }
}

export async function GetAccountInfo(req,res){
    try{
        const rpc_url_testnet = process.env.RPC_URL_TESTNET;
        const classicAddress = req.params.classicAddress;
        console.log("req.params.classicAddress",classicAddress);
        console.log(typeof(classicAddress));
        const client = new xrpl.Client(rpc_url_testnet);
          client.on('error', (error) => {
            console.log('XRPL Client Error:', error);
        });
        await client.connect();
        console.log("After Connect");
        const response = await client.request({
            "command": "account_info",
            "account": classicAddress, // Classic Address 
            "ledger_index": "validated"
          });
    
        // Listen to ledger close events
      client.request({
        "command": "subscribe",
        "streams": ["ledger"]
      })
      client.on("ledgerClosed", async (ledger) => {
        console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
      })
        await client.disconnect();
        return res.status(RESPONSES.SUCCESS).send({
          status : RESPONSES.SUCCESS,
          message : RES_MSG.DATA_FOUND,
          data:{
            response
          }
        })

    }catch(error){
        return res.status(RESPONSES.INTERNALSERVER).send({
            status : RESPONSES.INTERNALSERVER,
            message : RES_MSG.INTERNAL_SERVER_ERROR,
            error: true
        })

    }
}

export async function SendXRP(req,res){
  try{
    const rpc_url_testnet = process.env.RPC_URL_TESTNET;
    const seed = req.params.seed;
    const {
      to
    } = req.body;
    const schema = Joi.object({
      to: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(RESPONSES.BADREQUEST).send({ message: 'Payload Validation', status: RESPONSES.BADREQUEST, data: `${error}` });
    }
    const client = new xrpl.Client(rpc_url_testnet);
    await client.connect();
    const standby_wallet = xrpl.Wallet.fromSeed(seed);
    console.log("standBy_wallet.address",standby_wallet.address);
    console.log("typeOf StandBy Wallet", typeof(standby_wallet.address));
    console.log("to",to);
    console.log("typeOf TO", typeof(to));
    // -------------------------------------------------------- Prepare transaction
    console.log("Inside SendXRP");
    const prepared = await client.autofill({
      "TransactionType": "Payment",
      "Account": standby_wallet.address,
      "Amount": xrpl.xrpToDrops(100),
      "Destination":to
    })
      console.log("After Prepared");
// ------------------------------------------------- Sign prepared instructions
  const signed = standby_wallet.sign(prepared)
  
// -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  const standByWalletBalance=  (await client.getXrpBalance(standby_wallet.address))
  const operationalWalletBalance = (await client.getXrpBalance(to)) 
  await client.disconnect();
  return res.status(RESPONSES.SUCCESS).send({
    status : RESPONSES.SUCCESS,
    message : RES_MSG.TRANSACTION_DONE,
    data :{
        balanceOfSender : standByWalletBalance,
        balanceOfReceiver : operationalWalletBalance
    }
  })
  }catch(error){
    return res.status(RESPONSES.INTERNALSERVER).send({
      status : RESPONSES.INTERNALSERVER,
      message : RES_MSG.TRANSACTION_FAILED,
      error: true
  })
  }
}

export async function GetAccountBalance(req,res){
try{
  const rpc_url_testnet = process.env.RPC_URL_TESTNET;
  const classicAddress = req.params.classicAddress;
  const client = new xrpl.Client(rpc_url_testnet);
  await client.connect();
  // const balanceOf = await client.getXrpBalance(classicAddress)
  console.log("classicAddress", classicAddress);
console.log("TypeOfclassicAddress",typeof(classicAddress));
  const operationalWalletBalance = await client.getXrpBalance(classicAddress);
  // rest of the code


  console.log("classicAddress", classicAddress);
  await client.disconnect();
  return res.status(RESPONSES.SUCCESS).send({
    status : RESPONSES.SUCCESS,
    message : RES_MSG.DATA_FOUND,
    data:{
        balanceOf : operationalWalletBalance
    }
  })

}catch(error){
  return res.status(RESPONSES.INTERNALSERVER).send({
    status : RESPONSES.INTERNALSERVER,
    message : RES_MSG.INTERNAL_SERVER_ERROR,
    error: true
})
}
}

