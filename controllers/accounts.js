
import xrpl from 'xrpl';
import { RESPONSES,RES_MSG } from '../common/response.js';
import * as dotenv from 'dotenv';
dotenv.config();


export async function CreateAccount(req, res){

    try{
        const rpc_url_testnet = process.env.RPC_URL_TESTNET;
        const client = new xrpl.Client(rpc_url_testnet);
        await client.connect();

    const test_wallet = xrpl.Wallet.generate();
    client.disconnect();
    return res.status(RESPONSES.SUCCESS).send({
      status : RESPONSES.SUCCESS,
      public_key : test_wallet.publicKey,    
      private_key : test_wallet.privateKey,
      classic_address : test_wallet.classicAddress,
      seed : test_wallet.seed,
      message : RES_MSG.DATA_CREATED
    })


    }catch(error){
        return res.status(RESPONSES.INTERNALSERVER).send({
            status : RESPONSES.INTERNALSERVER,
            message : RES_MSG.INTERNAL_SERVER_ERROR,
            error: true
        })

    }    

}