import DonateHistoryCollection from "../db/model/DonationHistory";
import { IDonateHistoryCollection, IDonateHistoryTemplate } from "../types/Interface/IDBmodel";


interface IDonationRepo {
    findOneDonation(donation_id: string): Promise<IDonateHistoryCollection | null>
    findManyUserDonation(user_id: string): Promise<IDonateHistoryCollection[]>
    findManyFundRaiserDonation(fund_id: string): Promise<IDonateHistoryCollection[]>
    findManyFundRaiserDonationByUser(fund_id: string, user_id: string): Promise<IDonateHistoryCollection[]>
    insertDonationHistory(data: IDonateHistoryTemplate): Promise<string | null | undefined>
}


class DonationRepo implements IDonationRepo {

    async findManyUserDonation(user_id: string): Promise<IDonateHistoryCollection[]> {
        const findMany = await DonateHistoryCollection.find({ profile_id: user_id });
        return findMany
    }

    async findManyFundRaiserDonation(fund_id: string): Promise<IDonateHistoryCollection[]> {
        const findMany = await DonateHistoryCollection.find({ fund_id });
        return findMany
    }

    async findManyFundRaiserDonationByUser(fund_id: string, user_id: string): Promise<IDonateHistoryCollection[]> {
        const findMany = await DonateHistoryCollection.find({ fund_id, profile_id: user_id });
        return findMany
    }

    async insertDonationHistory(data: IDonateHistoryTemplate): Promise<string | null | undefined> {
        const instance = new DonateHistoryCollection(data);
        const save = await instance.save()
        return save?.id
    }

    async findOneDonation(donation_id: string): Promise<IDonateHistoryCollection | null> {
        const findOne = await DonateHistoryCollection.findOne({ donation_id });
        return findOne
    }
}

export default DonationRepo