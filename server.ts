import express, { Express } from 'express';
import dotenv from 'dotenv'
// import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import fundRaiseDbConnection from './src/db/mongo_connection';
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter';
import path from 'path'
import PaymentHelper from './src/util/helper/paymentHelper';
import FundRaiserService from './src/services/FundRaiserService';

const envPath = path.resolve(__dirname, "../.env")
console.log(envPath);
dotenv.config({ path: envPath });



fundRaiseDbConnection()

const app: Express = express();
const PORT = process.env.PORT || 7005

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan("dev"))

const SmeeClient = require('smee-client')

const smee = new SmeeClient({
    source: 'https://smee.io/XLWna6tXQfipghBJ',
    target: `http://${process.env.FUND_RAISE_PAYMENT_VERIFY}/verify-payment`,
    logger: console
})
smee.start()

const staticPath = path.join(__dirname, 'public/images');
console.log(`Serving static files from: ${staticPath}`);

app.use("/image", express.static(staticPath))

app.use("/", userRouter)
app.use("/admin", adminRouter)


app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT)
})
