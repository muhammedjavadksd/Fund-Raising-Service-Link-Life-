import { StatusCode } from "../Enums/UtilEnum"


interface HelperFuncationResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: any
}

interface IPaginatedResponse<T> {
    paginated: T[]
    total_records: number
}



export { HelperFuncationResponse, IPaginatedResponse }