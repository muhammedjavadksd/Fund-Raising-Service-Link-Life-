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


export { HelperFuncationResponse, IPaginatedResponse, ICloseFundRaiseJwtToken }