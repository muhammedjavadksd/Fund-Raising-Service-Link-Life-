import axios from "axios"
import DonationRepo from "../repositorys/DonationRepo"
import FundRaiserRepo from "../repositorys/FundRaiserRepo"
import PaymentOrderRepo from "../repositorys/PaymentOrderRepo"
import PaymentWebHookRepo from "../repositorys/PaymentWebHookRepo"
import { PaymentVia, StatusCode } from "../types/Enums/UtilEnum"
import { IDonateHistoryTemplate, IPaymentOrder } from "../types/Interface/IDBmodel"
import { HelperFuncationResponse, IVerifyPaymentResponse } from "../types/Interface/Util"
import PaymentHelper from "../util/helper/paymentHelper"
import UtilHelper from "../util/helper/utilHelper"
import BankAccountRepo from "../repositorys/BankAccountRepo"
import FundRaiserProvider from "../communication/provider"
import { clear } from "console"


interface IDonationService {
    transferAmountToBenf(amount: number, fundId: string, donation_id: string): Promise<HelperFuncationResponse>
    creatOrder(profile_id: string, name: string, phone_number: number, email_address: string, amount: number, fund_id: string, hide_profile: boolean, via: PaymentVia): Promise<HelperFuncationResponse>
    verifyPayment(order_id: string): Promise<HelperFuncationResponse>
    findPrivateProfileHistoryPaginated(profile_id: string, limit: number, page: number): Promise<HelperFuncationResponse>
    findMyDonationHistory(profile_id: string, limit: number, page: number): Promise<HelperFuncationResponse>
    findDonationByOrderId(order_id: string, profile_id: string): Promise<HelperFuncationResponse>
    getStatitics(): Promise<HelperFuncationResponse>
}


class DonationService implements IDonationService {

    private readonly paymentHelper
    private readonly orderRepo
    private readonly fundRepo;
    private readonly webHookRepo;
    private readonly donationHistoryRepo;
    private readonly bankRepo;

    constructor() {
        this.paymentHelper = new PaymentHelper()
        this.orderRepo = new PaymentOrderRepo()
        this.fundRepo = new FundRaiserRepo()
        this.webHookRepo = new PaymentWebHookRepo()
        this.donationHistoryRepo = new DonationRepo()
        this.bankRepo = new BankAccountRepo()
        this.findPrivateProfileHistoryPaginated = this.findPrivateProfileHistoryPaginated.bind(this)
        this.findMyDonationHistory = this.findMyDonationHistory.bind(this)
        this.findDonationByOrderId = this.findDonationByOrderId.bind(this)
    }


    async getStatitics(): Promise<HelperFuncationResponse> {

        const fundRaiser = await this.fundRepo.getStatitics();
        const donation = await this.donationHistoryRepo.getStatitics();

        return {
            status: true,
            msg: "Items found",
            statusCode: StatusCode.OK,
            data: {
                fund_raiser: fundRaiser,
                donation: donation
            }
        }
    }

    async findDonationByOrderId(order_id: string, profile_id: string): Promise<HelperFuncationResponse> {
        const profile = await this.donationHistoryRepo.findOrder(order_id);
        if (profile) {
            if (!profile.profile_id || (profile.profile_id == profile_id)) {
                return {
                    status: true,
                    msg: "Order found",
                    statusCode: StatusCode.OK,
                    data: profile
                }
            } else {
                return {
                    status: true,
                    msg: "Un authrazied access",
                    statusCode: StatusCode.UNAUTHORIZED,
                }
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async transferAmountToBenf(amount: number, fundId: string, donation_id: string): Promise<HelperFuncationResponse> {
        try {
            const findProfile = await this.fundRepo.findFundPostByFundId(fundId);
            if (findProfile) {
                const findBen = await this.bankRepo.findOne(findProfile.withdraw_docs.benf_id);
                if (findBen) {
                    const options = {
                        method: 'POST',
                        url: 'https://sandbox.cashfree.com/payout/transfers',
                        headers: {
                            accept: 'application/json',
                            'x-api-version': '2024-01-01',
                            'content-type': 'application/json',
                            'x-client-id': process.env.CASHFREE_PAYOUT_KEY,
                            'x-client-secret': process.env.CASHFREE_PAYOUT_SECRET
                        },
                        data: {
                            beneficiary_details: {
                                beneficiary_instrument_details: {
                                    bank_account_number: findBen.account_number,
                                    bank_ifsc: findBen.ifsc_code
                                },
                                beneficiary_id: findProfile.benf_id,
                                beneficiary_name: findBen.holder_name
                            },
                            transfer_id: donation_id,
                            transfer_amount: amount,
                            transfer_currency: 'INR',
                            transfer_mode: 'banktransfer'
                        }
                    };

                    const transfer = (await axios.request(options)).data
                    if (transfer && transfer.status && transfer.status == "RECEIVED") {
                        return {
                            status: true,
                            msg: "Payment transfer scheduled",
                            statusCode: StatusCode.OK
                        }
                    } else {
                        return {
                            status: false,
                            msg: "Something went wrong",
                            statusCode: StatusCode.BAD_REQUESR
                        }
                    }
                } else {
                    return {
                        status: false,
                        msg: "No active bank account found",
                        statusCode: StatusCode.BAD_REQUESR
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Something went wrong",
                    statusCode: StatusCode.BAD_REQUESR
                }
            }
        } catch (e) {
            return {
                status: false,
                msg: "Something went wrong",
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }


    async findMyDonationHistory(profile_id: string, limit: number, page: number): Promise<HelperFuncationResponse> {
        const skip: number = (page - 1) * limit
        const findHistory = await this.donationHistoryRepo.findUserDonationHistory(profile_id, limit, skip);
        console.log(findHistory);

        if (findHistory.total_records) {
            return {
                msg: "Histroy found",
                status: true,
                statusCode: StatusCode.OK,
                data: findHistory
            }
        } else {
            return {
                msg: "No data found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async findPrivateProfileHistoryPaginated(profile_id: string, limit: number, page: number): Promise<HelperFuncationResponse> {
        const skip: number = (page - 1) * limit
        const findHistory = await this.donationHistoryRepo.findPrivateProfilePaginedtHistory(profile_id, limit, skip);
        console.log("Came here");

        if (findHistory.total_records) {
            return {
                msg: "Histroy found",
                status: true,
                statusCode: StatusCode.OK,
                data: findHistory
            }
        } else {
            return {
                msg: "No data found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async creatOrder(profile_id: string, name: string, phone_number: number, email_address: string, amount: number, fund_id: string, hide_profile: boolean, via: PaymentVia): Promise<HelperFuncationResponse> {

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
                item_details_url: `${process.env.FRONT_END}/fund-raising/view/${fund_id}`,
                item_id: fund_id,
                item_name: itemName
            }], profile_id, email_address, phone_number, name, via);
            const paymentOrder: IPaymentOrder = {
                amount: amount,
                email: email_address,
                date: new Date(),
                fund_id,
                order_id,
                status: false,
                hide_profile,
                profile_id,
                name,
            }
            await this.orderRepo.insertOne(paymentOrder)
            console.log(createOrder);

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
        const findOrder = await this.orderRepo.findOne(order_id)
        console.log("The irder");

        console.log(findOrder);


        let receipt: string = 'donation';


        const utilHelper = new UtilHelper();
        if (verifyPayment) {
            console.log("Verifiying payment")
            console.log(verifyPayment)
            console.log(findOrder)
            // if (findOrder && !findOrder.status) {
            if (findOrder) {
                const fundRaise = await this.fundRepo.findFundPostByFundId(findOrder.fund_id);
                if (fundRaise) {
                    await this.orderRepo.updateStatus(order_id, true)
                    const campignTitle = utilHelper.generateFundRaiserTitle(fundRaise)
                    try {
                        const donatedDate = utilHelper.formatDateToMonthNameAndDate(findOrder.date)
                        const certificateName: string = await this.paymentHelper.createReceipt(findOrder.name, campignTitle, findOrder.amount, donatedDate, findOrder.order_id)
                        if (certificateName) {
                            receipt = certificateName;
                        }
                    } catch (e) {
                        console.log(e);
                        console.log("Certification creation failed");
                    }


                    clear()
                    console.log("Certificate created");
                    console.log(receipt);


                    let randomNumber: number = utilHelper.generateAnOTP(4)
                    let randomText: string = utilHelper.createRandomText(4)
                    let donationId = randomText + randomNumber;
                    let findDonation = await this.donationHistoryRepo.findOneDonation(donationId);
                    while (findDonation) {
                        randomNumber++
                        donationId = randomText + randomNumber;
                        findDonation = await this.donationHistoryRepo.findOneDonation(donationId);
                    }
                    let isSettled = false
                    const transferAmount = await this.transferAmountToBenf(verifyPayment?.data?.order?.order_amount, findOrder.fund_id, donationId);
                    if (transferAmount.status) {
                        isSettled = true
                    }
                    const donationHistory: IDonateHistoryTemplate = {
                        order_id,
                        is_settled: isSettled,
                        amount: verifyPayment?.data?.order?.order_amount,
                        date: new Date(),
                        donation_id: donationId.toUpperCase(),
                        fund_id: findOrder?.fund_id,
                        hide_profile: findOrder.hide_profile,
                        profile_id: findOrder.profile_id,
                        receipt,
                        name: findOrder.name
                    }
                    console.log("Donation history");
                    console.log(donationHistory)
                    const updatedAmount = fundRaise.collected + (verifyPayment?.data?.order?.order_amount || 0)
                    await this.fundRepo.updateFundRaiser(fundRaise.fund_id, { collected: updatedAmount })
                    await this.webHookRepo.updateWebhookStatus(order_id, true)
                    // const insertHistory = await this.donationHistoryRepo.insertDonationHistory(donationHistory)
                    const notification = new FundRaiserProvider(process.env.DONATION_SUCCESS_QUEUE || "")
                    await notification._init__();
                    const transterData = notification.transferData({
                        certificate_url: receipt,
                        name: findOrder.name,
                        amount: findOrder.amount,
                        campign_title: campignTitle,
                        email: findOrder.email
                    })

                    console.log("Transfer data");
                    console.log(transterData);
                    console.log(process.env.DONATION_SUCCESS_QUEUE);
                    console.log(process.env);




                    // console.log(insertHistory);

                    return {
                        status: true,
                        msg: "Payment success",
                        statusCode: StatusCode.OK,
                    }
                } else {
                    return {
                        status: false,
                        msg: "Order not found",
                        statusCode: StatusCode.NOT_FOUND,
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Order not found",
                    statusCode: StatusCode.NOT_FOUND,
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