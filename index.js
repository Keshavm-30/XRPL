import express from 'express';
import bodyParser from 'body-parser';
import AccountRouter from './routes/accounts.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
  
app.use('/api/v1', AccountRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
    