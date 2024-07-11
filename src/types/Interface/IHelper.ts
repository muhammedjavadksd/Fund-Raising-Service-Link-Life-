import jwt from "jsonwebtoken"


interface ITokenHelper {
    createJWTToken(payload: object, timer: number): Promise<string | null>
    decodeJWTToken(jwtToken: string): Promise<jwt.Jwt | null>
    checkTokenValidity(token: string): Promise<jwt.JwtPayload | false | string>
}

export { ITokenHelper }