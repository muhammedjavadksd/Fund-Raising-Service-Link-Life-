
import jwt from 'jsonwebtoken'
import { ITokenHelper } from '../../types/Interface/IHelper';


class TokenHelper implements ITokenHelper {
    async createJWTToken(payload = {}, timer: number): Promise<string | null> {
        try {
            let jwtToken = await jwt.sign(payload, process.env.JWT_SECRET as string, { algorithm: "HS256", expiresIn: timer });
            return jwtToken
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async decodeJWTToken(jwtToken: string): Promise<jwt.Jwt | null> {
        try {
            let decode = await jwt.decode(jwtToken, { complete: true });
            return decode
        } catch (e) {
            return null;
        }
    }

    async checkTokenValidity(token: string): Promise<jwt.JwtPayload | false | string> {
        try {
            let checkValidity = await jwt.verify(token, process.env.JWT_SECRET as string);
            return checkValidity
        } catch (e) {
            return false
        }
    }
}


export default TokenHelper
