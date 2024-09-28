import BankAccountCollection from "../db/model/BankAccount";
import { IBankAccount, IBankAccountCollection } from "../types/Interface/IDBmodel";

interface IBankAccountRepo {
    findOne(benfId: string): Promise<IBankAccountCollection | null>
    findAccountByProfile(fund_id: string): Promise<IBankAccountCollection[]>
    deleteOne(benId: string): Promise<boolean>
    updateOne(benId: string, data: Partial<IBankAccount>): Promise<boolean>
    insertOne(data: IBankAccount): Promise<boolean>
}


class BankAccountRepo implements IBankAccountRepo {

    async findOne(benfId: string): Promise<IBankAccountCollection | null> {
        const findone = await BankAccountCollection.findOne({ befId: benfId });
        return findone
    }

    async findAccountByProfile(fund_id: string): Promise<IBankAccountCollection[]> {
        const findProfile: IBankAccountCollection[] = await BankAccountCollection.find({ fund_id });
        return findProfile
    }

    async deleteOne(benId: string): Promise<boolean> {
        const deleteOne = await BankAccountCollection.deleteOne({ befId: benId })
        return deleteOne.deletedCount > 0
    }

    async updateOne(benfId: string, data: Partial<IBankAccount>): Promise<boolean> {
        const update = await BankAccountCollection.updateOne({ befId: benfId }, { $set: { ...data } });
        return update.modifiedCount > 0
    }

    async insertOne(data: IBankAccount): Promise<boolean> {
        const instance = new BankAccountCollection(data);
        const save = await instance.save();
        return !!save.id
    }
}

export default BankAccountRepo