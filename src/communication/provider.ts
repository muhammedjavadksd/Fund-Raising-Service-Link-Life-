import amqplib from 'amqplib';
import { config } from 'dotenv';

interface IFundRaiserProvider {
    _init__(): Promise<void>
    transferData(data: any): boolean
}


class FundRaiserProvider implements IFundRaiserProvider {

    channel: amqplib.Channel | undefined;
    queue;

    constructor(queueName: string) {
        this.queue = queueName
    }

    async _init__(): Promise<void> {
        console.log(process.env.RABBITMQ_URL || "");
        config()
        console.log(process.env.RABBITMQ_URL || "");

        const connection = await amqplib.connect(process.env.RABBITMQ_URL || "");
        const channel = await connection.createChannel();
        await channel.assertQueue(this.queue);
        this.channel = channel;
    }

    transferData(data: any): boolean {
        if (this.channel) {
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)));
            return true
        } else {
            console.log("Connection not found");
            return false
        }
    }
}

export default FundRaiserProvider;
