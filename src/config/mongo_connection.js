"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function fundRaiseDbConnection() {
    const connectionURL = process.env.MONGO_URL;
    mongoose_1.default.connect(connectionURL).then(() => {
        console.log("Fund raise database has been connected");
    }).catch((err) => {
        console.log(err);
        console.log("Fund raise database has been failed");
    });
}
exports.default = fundRaiseDbConnection;
// module.exports = fundRaiseDbConnection
