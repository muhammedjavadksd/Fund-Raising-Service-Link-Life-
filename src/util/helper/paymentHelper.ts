import axios from "axios"
import { IOrderTemplate, IPaymentItem, IVerifyPaymentResponse } from "../../types/Interface/Util";



interface IPaymentHelper {
    verifyPayment(order_id: string): Promise<IVerifyPaymentResponse | false>
    createOrder(order_id: string, amount: number, item_name: string, items: IPaymentItem[], profile_id: string, email_address: string, phone: number, full_name: string): Promise<IOrderTemplate | null>
}


class PaymentHelper implements IPaymentHelper {

    async verifyPayment(order_id: string): Promise<IVerifyPaymentResponse | false> {
        const config = {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.x_client_id,
                'x-client-secret': process.env.x_client_secret
            }
        };
        try {
            const create = await axios.get(`${process.env.PAYMENT_BASE_ENDPOINT}/pg/orders/${order_id}`, config);
            const response_data: IOrderTemplate = create.data;
            if (response_data.order_status != "PAID") return false
            return {
                cart_details: response_data.cart_details,
                created_at: response_data.created_at,
                customer_details: response_data.customer_details,
                order_amount: response_data.order_amount,
                order_id,
                order_status: response_data.order_status
            }
        } catch (e) {
            return false;
        }
    }


    async createOrder(order_id: string, amount: number, item_name: string, items: IPaymentItem[], profile_id: string, email_address: string, phone: number, full_name: string): Promise<IOrderTemplate | null> {
        try {
            const data = {
                cart_details: {
                    shipping_charge: 0,
                    cart_name: item_name,
                    cart_items: items
                },
                customer_details: {
                    customer_id: profile_id,
                    customer_email: email_address,
                    customer_phone: phone,
                    customer_name: name
                },
                order_id: order_id,
                order_amount: amount,
                order_currency: "INR"
            };

            const config = {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-api-version': '2023-08-01',
                    'x-client-id': process.env.x_client_id,
                    'x-client-secret': process.env.x_client_secret
                }
            };
            const create = await axios.post(`${process.env.PAYMENT_BASE_ENDPOINT}/pg/orders`, data, config);
            const response_data = create.data;
            return response_data;
        } catch (e) {
            console.log(e);
            return null
        }
    }
}


export default PaymentHelper
