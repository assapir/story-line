import argon2 from "argon2";

export default class CryptoService {
    public static async createPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    public static async isPasswordCorrect(encryptedPassword: string, passwordAttempt: string):
        Promise<boolean> {
        return await argon2.verify(encryptedPassword, passwordAttempt);
    }
}
