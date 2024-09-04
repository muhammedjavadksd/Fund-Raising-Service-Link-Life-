import { JwtType, StatusCode } from "../Enums/UtilEnum"


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







export { WebhookPayload, HelperFuncationResponse, IPaginatedResponse, ICloseFundRaiseJwtToken }