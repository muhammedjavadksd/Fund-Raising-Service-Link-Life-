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
// console.log("Path : ", path.join(__dirname, "public"));

// app.use(fileUpload({ createParentPath: true }))
app.use(morgan("dev"))

const fund = new FundRaiserService();


// fund.addBeneficiary("1234", "Javad", "muhammedjavad@gmail.com", "9744727684", "18910100014554", "FDRL0001891", "EROL ")

// import fs from 'fs';

// const imagePath = path.join(__dirname, 'public/images/fund_raiser_image/a.jpg');
// fs.access(imagePath, fs.constants.F_OK, (err) => {
//     console.log(`${imagePath} ${err ? 'does not exist' : 'exists'}`);
// });

// aws --endpoint-url=http://localhost:4566 s3 mb s3://other-images s3://fund-raiser-certificate-bucket

// new PaymentHelper().createReceipt("Muhammed Javad", "Javad Fund Raising Campign", 500, "May 24th", "Sample ID").then((data) => { })


const SmeeClient = require('smee-client')

const smee = new SmeeClient({
    source: 'https://smee.io/XLWna6tXQfipghBJ',
    target: 'http://localhost:7001/api/fund_raise/verify-payment',
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
