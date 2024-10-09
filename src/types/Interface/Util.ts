import { JwtType, StatusCode } from "../Enums/UtilEnum"
import { Request } from 'express';

interface IDonationStatitics {
    date: string,
    amount: number
}

interface HelperFuncationResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: any
}

interface IPaginatedResponse<T> {
    paginated: []
    total_records: number
}

interface ICloseFundRaiseJwtToken {
    fund_id: string,
    type: JwtType
}


interface OrderDetails {
    order_id: string;
    order_amount: number;
    order_currency: string;
    order_tags: string | null;
}

interface PaymentMethodDetails {
    [key: string]: any;
}

interface PaymentDetails {
    cf_payment_id: number;
    payment_status: string;
    payment_amount: number;
    payment_currency: string;
    payment_message: string | null;
    payment_time: string;
    bank_reference: string | null;
    auth_id: string | null;
    payment_method: PaymentMethodDetails;
    payment_group: string;
}

interface CustomerDetails {
    customer_name: string | null;
    customer_id: string;
    customer_email: string | null;
    customer_phone: string;
}

interface ChargesDetails {
    service_charge: number;
    service_tax: number;
    settlement_amount: number;
    settlement_currency: string;
    service_charge_discount: number | null;
}

interface WebhookPayload {
    data: {
        order: OrderDetails;
        payment: PaymentDetails;
        customer_details: CustomerDetails;
        charges_details: ChargesDetails;
    };
    event_time: string;
    type: string;

}


interface IPaymentItem {
    item_id: string,
    item_name: string,
    item_description: string,
    item_details_url: string
}


interface IVerifyPaymentResponse {
    data: {
        created_at: string
        cart_details: CartDetails
        customer_details: CustomerDetails
        order_status: string
        order: {
            order_id: string,
            order_amount: number,
            order_currency: string,
        },
        payment: {
            cf_payment_id: number,
            payment_status: string,
            payment_amount: number,
            payment_currency: string,
            payment_time: string
        }
    }
}

interface IOrderTemplate {
    cart_details: CartDetails
    cf_order_id: string
    created_at: string
    customer_details: CustomerDetails
    entity: string
    order_amount: number
    order_currency: string
    order_expiry_time: string
    order_id: string
    order_meta: OrderMeta
    order_note: any
    order_status: string
    order_splits: any[]
    order_tags: any
    payment_session_id: string
    terminal_data: any
}

interface CartDetails {
    cart_id: string
}

interface CustomerDetails {
    customer_id: string
    customer_name: string | null
    customer_email: string | null
    customer_phone: string
    customer_uid: any
}

interface OrderMeta {
    return_url: any
    notify_url: any
    payment_methods: any

}
interface CustomRequest extends Request {
    context?: Record<string, any>
}

export { CustomRequest, IVerifyPaymentResponse, IOrderTemplate, WebhookPayload, IPaymentItem, HelperFuncationResponse, IPaginatedResponse, ICloseFundRaiseJwtToken, IDonationStatitics }