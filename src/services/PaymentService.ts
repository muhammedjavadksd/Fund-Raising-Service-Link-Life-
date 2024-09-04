import { HelperFuncationResponse } from "../types/Interface/Util"


interface IPaymentService {
    creatOrder(name: string, phone_number: number, email_address: string, amount: number): Promise<HelperFuncationResponse>
    verifyPayment(order_id: string): Promise<HelperFuncationResponse>
}


class PaymentService implements IPaymentService {


}

export default IPaymentService