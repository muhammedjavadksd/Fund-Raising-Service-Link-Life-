import amqplib from 'amqplib';

// const queueName = process.env.AUTH_DATA_UPDATE_QUEUE!;

class FundRaiserProvider {


    channel: amqplib.Channel | undefined;
    queue;

    constructor(queueName: string) {
        this.queue = queueName
    }

    async _init__() {
        const connection = await amqplib.connect("amqp://localhost");
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
