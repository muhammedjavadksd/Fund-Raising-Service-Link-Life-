
import jwt from 'jsonwebtoken'
import { ITokenHelper } from '../../types/Interface/IHelper';
import { JwtTimer } from '../../types/Enums/UtilEnum';


class TokenHelper implements ITokenHelper {
    async createJWTToken(payload = {}, timer: JwtTimer): Promise<string | null> {
        try {
            const jwtToken = await jwt.sign(payload, process.env.JWT_SECRET as string, { algorithm: "HS256", expiresIn: timer });
            return jwtToken
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async decodeJWTToken(jwtToken: string): Promise<jwt.Jwt | null> {
        try {
            const decode = await jwt.decode(jwtToken, { complete: true });
            return decode
        } catch (e) {
            return null;
        }
    }

    async checkTokenValidity(token: string): Promise<jwt.JwtPayload | false | string> {
        try {
            const checkValidity = await jwt.verify(token, process.env.JWT_SECRET as string);
            return checkValidity
        } catch (e) {
            return false
        }
    }
}


export default TokenHelper
