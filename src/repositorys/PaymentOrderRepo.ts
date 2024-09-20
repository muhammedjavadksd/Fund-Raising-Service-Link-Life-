import { ObjectId } from "mongoose";
import { IPaymentOrder, IPaymentOrderCollection } from "../types/Interface/IDBmodel";
import PaymentOrderCollection from "../db/model/PaymentOrder";


interface IPaymentOrderRepo {
    insertOne(data: IPaymentOrder): Promise<ObjectId | null | undefined>
    findOne(order_id: string): Promise<IPaymentOrderCollection | null>
    updateStatus(order_id: string, status: boolean): Promise<boolean>
}

class PaymentOrderRepo implements IPaymentOrderRepo {






    async insertOne(data: IPaymentOrder): Promise<ObjectId | null | undefined> {
        const instance = new PaymentOrderCollection(data);
        const save = await instance.save()
        return save?.id
    }

    async findOne(order_id: string): Promise<IPaymentOrderCollection | null> {
        const find = await PaymentOrderCollection.findOne({ order_id });
        return find
    }

    async updateStatus(order_id: string, status: boolean): Promise<boolean> {
        const updateStatus = await PaymentOrderCollection.updateOne({ order_id }, { $set: { status } });
        return updateStatus.modifiedCount > 0
    }

}

export default PaymentOrderRepo