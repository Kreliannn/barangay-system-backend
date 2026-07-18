process.env.TZ = 'Asia/Manila';

import express,{ Request, Response } from 'express';
import mongoose from 'mongoose';
import routes from "./routes/route"
import cors from "cors"
import dotenv from 'dotenv';
import 'dotenv/config';
import documentRequestModel from './model/documentRequest.model';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongodb_uri = process.env.MONGODB_URI || "";


app.set('trust proxy', 1);
  
app.use(express.json());
app.use(cors()); 
app.use(routes)

mongoose.connect(mongodb_uri)

app.get('/', async (request: Request, response: Response) => {
  response.send("working server...........")
});


app.get('/test', async (request: Request, response: Response) => {

  const prices = [30, 45, 50, 80];

  const documents = await documentRequestModel.find({
    price: { $exists: false }
  });

  for (const doc of documents) {
    const randomPrice = prices[Math.floor(Math.random() * prices.length)];

    doc.price = randomPrice;
    await doc.save();
  }


  response.send("working server...........")
});


app.listen(port, () => {
  const date = new Date
  console.log(`Server is running on http://localhost:${port} date: ${date}`);
});
