
import xrpl from 'xrpl';
import { RESPONSES,RES_MSG } from '../common/response.js';
import * as dotenv from 'dotenv';
dotenv.config();


export async function CreateAccount(req, res){

    try{
        console.log("GitChanges");
        const rpc_url_testnet = process.env.RPC_URL_TESTNET;
        const client = new xrpl.Client(rpc_url_testnet);
        await client.connect();

    // const test_wallet = xrpl.Wallet.generate();
    const fund_result = await client.fundWallet();
    const test_wallet = fund_result.wallet
    client.disconnect();
    return res.status(RESPONSES.SUCCESS).send({
      status : RESPONSES.SUCCESS,
      message : RES_MSG.DATA_CREATED,
      data :{
      public_key : test_wallet.publicKey,    
      private_key : test_wallet.privateKey,
      classic_address : test_wallet.classicAddress,
      seed : test_wallet.seed,
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

