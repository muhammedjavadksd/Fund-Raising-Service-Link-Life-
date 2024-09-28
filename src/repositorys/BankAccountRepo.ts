import BankAccountCollection from "../db/model/BankAccount";
import { IBankAccount, IBankAccountCollection } from "../types/Interface/IDBmodel";
import { IPaginatedResponse } from "../types/Interface/Util";

interface IBankAccountRepo {
    findOne(benfId: string): Promise<IBankAccountCollection | null>
    findPaginatedAccountsByProfile(fund_id: string, skip: number, limit: number): Promise<IPaginatedResponse<IBankAccountCollection>>
    deleteOne(benId: string): Promise<boolean>
    updateOne(benId: string, data: Partial<IBankAccount>): Promise<boolean>
    insertOne(data: IBankAccount): Promise<boolean>
    findByAccountNumber(account: number): Promise<IBankAccountCollection | null>
}


class BankAccountRepo implements IBankAccountRepo {

    async findByAccountNumber(account: number): Promise<IBankAccountCollection | null> {
        const findByAccountNumber = await BankAccountCollection.findOne({ account_number: account });
        return findByAccountNumber
    }

    async findOne(benfId: string): Promise<IBankAccountCollection | null> {
        const findone = await BankAccountCollection.findOne({ befId: benfId });
        return findone
    }

    async findPaginatedAccountsByProfile(fund_id: string, skip: number, limit: number): Promise<IPaginatedResponse<IBankAccountCollection>> {

        try {
            const findProfile = await BankAccountCollection.aggregate([
                {
                    $match: {
                        fund_id
                    }
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ]);

            const response: IPaginatedResponse<IBankAccountCollection> = {
                paginated: findProfile[0].paginated,
                total_records: findProfile[0].total_records,
            }
            return response
        } catch (e) {
            return {
                paginated: [],
                total_records: 0
            }
        }
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