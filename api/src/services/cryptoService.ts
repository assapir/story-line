import argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { config } from "../consts";
import User from "../models/user";

export default class CryptoService {
    // for production, get it from environment variable
    private static readonly jwtSecret = config.env === config.ProductionEnvironment ?
                                config.jwtSecret :
                                process.env.JWT_SECRET;

    public async createPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    public async isPasswordCorrect(encryptedPassword: string, passwordAttempt: string):
        Promise<boolean> {
        return await argon2.verify(encryptedPassword, passwordAttempt);
    }

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
