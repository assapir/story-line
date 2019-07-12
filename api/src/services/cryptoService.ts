import * as crypto from "crypto";
import { promisify } from "util";

export default class CryptoService {
    public static async createPasswordAndSalt(password: string): Promise<[string, string]> {
        const salt = await CryptoService.randomBytes(CryptoService.saltLength);
        const base64Salt = salt.toString(`base64`);
        const hashBuffer = await CryptoService.pbkdf2(
            password,
            base64Salt,
            CryptoService.passwordIterations,
            CryptoService.keyLength,
            CryptoService.digest);

        return [hashBuffer.toString(`hex`), base64Salt];
    }

    public static async isPasswordCorrect(salt: string, saltedPassword: string, passwordAttempt: string):
        Promise<boolean> {
        const hashBuffer = await CryptoService.pbkdf2(
            passwordAttempt,
            salt,
            CryptoService.passwordIterations,
            CryptoService.keyLength,
            CryptoService.digest,
        );

        const hashAttempt = hashBuffer.toString(`hex`);
        return saltedPassword === hashAttempt;
    }

    private static pbkdf2 = promisify(crypto.pbkdf2);
    private static randomBytes = promisify(crypto.randomBytes);

    private static passwordIterations: number = 10000;
    private static saltLength: number = 128;
    private static keyLength: number = 64;
    private static digest: string = `sha256`;
}
