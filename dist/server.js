"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const morgan_1 = __importDefault(require("morgan"));
const mongo_connection_1 = __importDefault(require("./src/db/mongo_connection"));
const userRouter_1 = __importDefault(require("./src/router/userRouter"));
const adminRouter_1 = __importDefault(require("./src/router/adminRouter"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: "./.env" });
(0, mongo_connection_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7005;
app.use(express_1.default.json({}));
app.use(express_1.default.urlencoded({ extended: true }));
// console.log("Path : ", path.join(__dirname, "public"));
app.use((0, express_fileupload_1.default)({ createParentPath: true }));
app.use((0, morgan_1.default)("dev"));
// import fs from 'fs';
// const imagePath = path.join(__dirname, 'public/images/fund_raiser_image/a.jpg');
// fs.access(imagePath, fs.constants.F_OK, (err) => {
//     console.log(`${imagePath} ${err ? 'does not exist' : 'exists'}`);
// });
const staticPath = path_1.default.join(__dirname, 'public/images');
console.log(`Serving static files from: ${staticPath}`);
app.use("/image", express_1.default.static(staticPath));
app.use("/", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT);
});
