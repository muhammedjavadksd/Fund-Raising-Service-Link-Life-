"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = require("dotenv");
class FundRaiserProvider {
    constructor(queueName) {
        this.queue = queueName;
    }
    _init__() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(process.env.RABBITMQ_URL || "");
            (0, dotenv_1.config)();
            console.log(process.env.RABBITMQ_URL || "");
            const connection = yield amqplib_1.default.connect(process.env.RABBITMQ_URL || "");
            const channel = yield connection.createChannel();
            yield channel.assertQueue(this.queue);
            this.channel = channel;
        });
    }
    transferData(data) {
        if (this.channel) {
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)));
            return true;
        }
        else {
            console.log("Connection not found");
            return false;
        }
    }
}
exports.default = FundRaiserProvider;
