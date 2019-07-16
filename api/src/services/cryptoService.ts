import * as jwt from "jsonwebtoken";
import { config } from "../consts";
import User from "../models/user";

export default class CryptoService {
    // for production, get it from environment variable
    private static readonly jwtSecret = config.env === config.ProductionEnvironment ?
                                config.jwtSecret :
                                process.env.JWT_SECRET;

    public signJWT(user: User): string {
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            CryptoService.jwtSecret,
            {
                expiresIn: `1h`,
            },
        );
        return token;
    }

    public verifyJWT(token: string): boolean {
        try {
            jwt.verify(token, config.jwtSecret);
            return true;
        } catch (error) {
            return false;
        }
    }
}
