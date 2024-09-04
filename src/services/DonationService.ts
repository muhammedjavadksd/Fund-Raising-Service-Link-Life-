import DonationRepo from "../repositorys/DonationRepo"
import FundRaiserRepo from "../repositorys/FundRaiserRepo"
import PaymentOrderRepo from "../repositorys/PaymentOrderRepo"
import PaymentWebHookRepo from "../repositorys/PaymentWebHookRepo"
import { StatusCode } from "../types/Enums/UtilEnum"
import { IDonateHistoryTemplate, IPaymentOrder } from "../types/Interface/IDBmodel"
import { HelperFuncationResponse, IVerifyPaymentResponse } from "../types/Interface/Util"
import PaymentHelper from "../util/helper/paymentHelper"
import UtilHelper from "../util/helper/utilHelper"


interface IDonationService {
    creatOrder(profile_id: string, name: string, phone_number: number, email_address: string, amount: number, fund_id: string, hide_profile: boolean): Promise<HelperFuncationResponse>
    verifyPayment(order_id: string): Promise<HelperFuncationResponse>
}


class DonationService implements IDonationService {

    private readonly paymentHelper
    private readonly orderRepo
    private readonly fundRepo;
    private readonly webHookRepo;
    private readonly donationHistoryRepo;

    constructor() {
        this.paymentHelper = new PaymentHelper()
        this.orderRepo = new PaymentOrderRepo()
        this.fundRepo = new FundRaiserRepo()
        this.webHookRepo = new PaymentWebHookRepo()
        this.donationHistoryRepo = new DonationRepo()

    }

    async creatOrder(profile_id: string, name: string, phone_number: number, email_address: string, amount: number, fund_id: string, hide_profile: boolean): Promise<HelperFuncationResponse> {

        const utilHelper = new UtilHelper();

        let randomNumber: number = utilHelper.generateAnOTP(4)
        let randomText: string = utilHelper.createRandomText(4)
        const orderPrefix: string = "PAY";
        let order_id = orderPrefix + randomNumber + randomText;
        let findOrder = await this.orderRepo.findOne(order_id);
        while (findOrder) {
            randomNumber++
            order_id = orderPrefix + randomNumber + randomText;
            findOrder = await this.orderRepo.findOne(order_id);
        }

        const fundProfile = await this.fundRepo.findFundPostByFundId(fund_id);
        if (fundProfile) {
            const itemName: string = `Fund donation for ${fundProfile.full_name} on their ${fundProfile.category}`
            const createOrder = await this.paymentHelper.createOrder(order_id, amount, itemName, [{
                item_description: fundProfile.about,
                item_details_url: `http://localhost:3000/fund-raising/view/${fund_id}`,
                item_id: fund_id,
                item_name: itemName
            }], profile_id, email_address, phone_number, name);
            const paymentOrder: IPaymentOrder = {
                amount: amount,
                date: new Date(),
                fund_id,
                order_id,
                status: false,
                hide_profile,
                profile_id
            }
            await this.orderRepo.insertOne(paymentOrder)
            if (createOrder) {

                return {
                    status: true,
                    msg: "Order created success",
                    statusCode: StatusCode.CREATED,
                    data: {
                        order: createOrder
                    }
                }
            }
        }

        return {
            status: false,
            msg: "Something went wrong",
            statusCode: StatusCode.BAD_REQUESR,
        }

    }

    async verifyPayment(order_id: string): Promise<HelperFuncationResponse> {

        const verifyPayment: IVerifyPaymentResponse | false = await this.paymentHelper.verifyPayment(order_id);
        if (verifyPayment) {
            const findOrder = await this.orderRepo.findOne(order_id)
            const receipt = ""
            if (findOrder) {

                const utilHelper = new UtilHelper();
                let randomNumber: number = utilHelper.generateAnOTP(4)
                let randomText: string = utilHelper.createRandomText(4)
                let donationId = randomText + randomNumber;
                let findDonation = await this.donationHistoryRepo.findOneDonation(donationId);
                while (findDonation) {
                    randomNumber++
                    donationId = randomText + randomNumber;
                    findDonation = await this.donationHistoryRepo.findOneDonation(donationId);
                }
                const donationHistory: IDonateHistoryTemplate = {
                    amount: verifyPayment.order_amount,
                    date: new Date(),
                    donation_id: donationId,
                    fund_id: findOrder?.fund_id,
                    hide_profile: findOrder.hide_profile,
                    profile_id: findOrder.profile_id,
                    receipt,
                }
                await this.webHookRepo.updateWebhookStatus(order_id, true)
                await this.donationHistoryRepo.insertDonationHistory(donationHistory)
                return {
                    status: true,
                    msg: "Payment success",
                    statusCode: StatusCode.OK,
                }
            }
        }
        return {
            status: false,
            msg: "Payment failed",
            statusCode: StatusCode.BAD_REQUESR,
        }
    }


}

export default DonationService