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
const utilHelper_1 = __importDefault(require("./src/util/helper/utilHelper"));
const envPath = path_1.default.resolve(__dirname, "../.env");
console.log(envPath);
dotenv_1.default.config({ path: envPath });
(0, mongo_connection_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7005;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
const s = new utilHelper_1.default();
s.createFundRaiserReport();
const SmeeClient = require('smee-client');
const smee = new SmeeClient({
    source: 'https://smee.io/XLWna6tXQfipghBJ',
    target: `http://${process.env.FUND_RAISE_PAYMENT_VERIFY}/verify-payment`,
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
