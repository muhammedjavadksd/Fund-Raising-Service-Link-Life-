import express, { Express } from 'express';
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'

const app: Express = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: ["http://localhost:3000", "https://life-link.online", "https://www.life-link.online"]
}))

import fundRaiseDbConnection from './src/db/mongo_connection';
const envPath = path.resolve(__dirname, "../.env")
console.log(envPath);
dotenv.config({ path: envPath });
const PORT = process.env.PORT || 7005
fundRaiseDbConnection()

app.use(morgan("dev"))

import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter';


const SmeeClient = require('smee-client')

const smee = new SmeeClient({
    source: 'https://smee.io/XLWna6tXQfipghBJ',
    target: `http://${process.env.FUND_RAISE_PAYMENT_VERIFY}/verify-payment`,
    logger: console
})
smee.start()

const staticPath = path.join(__dirname, 'public/images');
console.log(`Serving static files from: ${staticPath}`);


app.use("/", userRouter)
app.use("/admin", adminRouter)


app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT)
})
