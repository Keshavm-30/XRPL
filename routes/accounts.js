import express from 'express';
import bodyParser from 'body-parser';
import {CreateAccountWithFunds,GetAccountFromSeed,GetAccountInfo,SendXRP,GetAccountBalance} from '../controllers/accounts.js'
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const apiKey = process.env.API_KEY;
const private_key = process.env.PRIVATE_KEY;
const public_key = process.env.PUBLIC_KEY;  




router.post("/SendXRP/:seed",SendXRP);
router.get("/creatAccount",CreateAccountWithFunds);
router.get("/GetAccountFromSeed/:seed",GetAccountFromSeed);
router.get("/GetAccountInfo/:classicAddress",GetAccountInfo);
router.get("/GetAccountBalance/:classicAddress",GetAccountBalance);




export default router;