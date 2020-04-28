import * as jwt from "jsonwebtoken";
import { config } from "../consts";
import UnauthorizedException from "../exceptions/unauthorizedException";

export interface IPayLoad {
    id: string;
    isValid: boolean;
    email: string;
}

export default class CryptoService {
    private static readonly jwtSecret = config.jwtSecret;

    public signJWT(payload: IPayLoad): string {
        // throw if the payload is invalid
        if (!payload.isValid) {
            throw new UnauthorizedException(`payload is invalid`);
        }

        const token = jwt.sign(
            {
                userId: payload.id,
                email: payload.email,
            },
            CryptoService.jwtSecret,
            {
                expiresIn: `1h`,
            },
        );
        return token;
    }

    public verifyJWT(token: string): IPayLoad {
        try {
            const payload = jwt.verify(token, CryptoService.jwtSecret);
            return {
                isValid: true,
                email: payload[`email`],
                id: payload[`userId`],
            };
        } catch (error) {
            return {
                isValid: false,
                email: ``,
                id: ``,
            };
        }
    }
}
