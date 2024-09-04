import { ObjectId } from "mongoose";
import PaymentWebHookCollection from "../db/model/paymentWebHook";
import { IWebhookCollection } from "../types/Interface/IDBmodel";
import { WebhookPayload } from "../types/Interface/Util";


interface IPaymentWebHookRepo {
    findOnePaymentRepo(order_id: string): Promise<IWebhookCollection | null>
    findUnCheckedWebHook(): Promise<IWebhookCollection[]>
    insertPaymentRepo(data: WebhookPayload): Promise<ObjectId | null | undefined>
    updateWebhookStatus(order_id: string, status: boolean): Promise<boolean>
}


class PaymentWebHookRepo implements IPaymentWebHookRepo {

    async findOnePaymentRepo(order_id: string): Promise<IWebhookCollection | null> {
        const find = await PaymentWebHookCollection.findOne({ "data.order.order_id": order_id });
        return find
    }

    async findUnCheckedWebHook(): Promise<IWebhookCollection[]> {
        const find = await PaymentWebHookCollection.find({ is_checked: false });
        return find
    }

    async insertPaymentRepo(data: WebhookPayload): Promise<ObjectId | null | undefined> {
        const instance = new PaymentWebHookCollection(data);
        const save = await instance.save()
        return save?._id as ObjectId
    }

    async updateWebhookStatus(order_id: string, status: boolean): Promise<boolean> {
        const find = await PaymentWebHookCollection.findOneAndUpdate({ "data.order.order_id": order_id, is_checked: status });
        return !!find?.isModified()
    }
}

export default PaymentWebHookRepo