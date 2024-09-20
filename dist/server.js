"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import fileUpload from 'express-fileupload'
const morgan_1 = __importDefault(require("morgan"));
const mongo_connection_1 = __importDefault(require("./src/db/mongo_connection"));
const userRouter_1 = __importDefault(require("./src/router/userRouter"));
const adminRouter_1 = __importDefault(require("./src/router/adminRouter"));
const path_1 = __importDefault(require("path"));
const FundRaiserService_1 = __importDefault(require("./src/services/FundRaiserService"));
const envPath = path_1.default.resolve(__dirname, "../.env");
console.log(envPath);
dotenv_1.default.config({ path: envPath });
(0, mongo_connection_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7005;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// console.log("Path : ", path.join(__dirname, "public"));
// app.use(fileUpload({ createParentPath: true }))
app.use((0, morgan_1.default)("dev"));
const fund = new FundRaiserService_1.default();
// fund.addBeneficiary("1234", "Javad", "muhammedjavad@gmail.com", "9744727684", "18910100014554", "FDRL0001891", "EROL ")
// import fs from 'fs';
// const imagePath = path.join(__dirname, 'public/images/fund_raiser_image/a.jpg');
// fs.access(imagePath, fs.constants.F_OK, (err) => {
//     console.log(`${imagePath} ${err ? 'does not exist' : 'exists'}`);
// });
// aws --endpoint-url=http://localhost:4566 s3 mb s3://other-images s3://fund-raiser-certificate-bucket
// new PaymentHelper().createReceipt("Muhammed Javad", "Javad Fund Raising Campign", 500, "May 24th", "Sample ID").then((data) => { })
const SmeeClient = require('smee-client');
const smee = new SmeeClient({
    source: 'https://smee.io/XLWna6tXQfipghBJ',
    target: 'http://localhost:7001/api/fund_raise/verify-payment',
    logger: console
});
smee.start();
const staticPath = path_1.default.join(__dirname, 'public/images');
console.log(`Serving static files from: ${staticPath}`);
app.use("/image", express_1.default.static(staticPath));
app.use("/", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT);
});
