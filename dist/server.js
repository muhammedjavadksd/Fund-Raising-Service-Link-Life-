"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://life-link.online", "https://www.life-link.online"]
}));
const mongo_connection_1 = __importDefault(require("./src/db/mongo_connection"));
const envPath = path_1.default.resolve(__dirname, "../.env");
console.log(envPath);
dotenv_1.default.config({ path: envPath });
const PORT = process.env.PORT || 7005;
(0, mongo_connection_1.default)();
// app.use(morgan("dev"))
const userRouter_1 = __importDefault(require("./src/router/userRouter"));
const adminRouter_1 = __importDefault(require("./src/router/adminRouter"));
const staticPath = path_1.default.join(__dirname, 'public/images');
console.log(`Serving static files from: ${staticPath}`);
app.use("/", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT);
});
