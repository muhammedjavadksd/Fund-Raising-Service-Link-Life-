import jwt from "jsonwebtoken"
import { FundRaiserCreatedBy } from "../Enums/DbEnum"
import { JwtTimer } from "../Enums/UtilEnum"
import { IFundRaise } from "./IDBmodel"


interface ITokenHelper {
    createJWTToken(payload: object, timer: JwtTimer): Promise<string | null>
    decodeJWTToken(jwtToken: string): Promise<jwt.Jwt | null>
    checkTokenValidity(token: string): Promise<jwt.JwtPayload | false | string>
}

interface IUtilHelper {
    createFundRaiseID(created_by: FundRaiserCreatedBy): string
    generateAnOTP(length: number): number
    createRandomText(length: number): string
    extractImageNameFromPresignedUrl(url: string): string | boolean
    generateFundRaiserTitle(profile: IFundRaise): string
    formatDateToMonthNameAndDate(date: Date): string
}

export { ITokenHelper, IUtilHelper }