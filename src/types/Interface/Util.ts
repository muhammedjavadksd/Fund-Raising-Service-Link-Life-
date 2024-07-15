import { StatusCode } from "../Enums/UtilEnum"


interface HelperFuncationResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: any
}




export { HelperFuncationResponse }