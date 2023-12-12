import express from 'express';
import bodyParser from 'body-parser';
import {CreateAccount} from '../controllers/accounts.js'
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const apiKey = process.env.API_KEY;
const private_key = process.env.PRIVATE_KEY;
const public_key = process.env.PUBLIC_KEY;  




router.get("/creatAccount",CreateAccount)





export default router;