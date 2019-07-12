import { expect } from "chai";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import CryptoService from "../../src/services/cryptoService";

describe(`CryptoService`, () => {
    describe(`createPasswordAndSalt`, () => {
        it(`should return a tuple of the salt and salted password`, async () => {
            const password = faker.hacker.phrase();
            const saltedPassword = await CryptoService.createPassword(password);
            expect(saltedPassword).to.have.lengthOf(95);
            expect(saltedPassword).not.to.equal(password);
        });

        it(`should not create the same salt or password 2 times`, async () => {
            const password0 = faker.hacker.phrase();
            const password1 = faker.hacker.phrase();
            const saltedPassword0 = await CryptoService.createPassword(password0);
            const saltedPassword1 = await CryptoService.createPassword(password1);
            expect(saltedPassword0).not.to.equal(saltedPassword1);
        });
    });

    describe(`isPasswordCorrect`, () => {
        let password: string;
        let saltedPassword: string;

        beforeEach(async () => {
            password = faker.hacker.phrase();
            saltedPassword = await CryptoService.createPassword(password);
        });

        it(`should return false if the password is incorrect`, async () => {
            const result = await CryptoService.isPasswordCorrect(saltedPassword, `not that password`);
            // tslint:disable-next-line: no-unused-expression
            expect(result).to.be.false;
        });

        it(`should return true if the password is correct`, async () => {
            const result = await CryptoService.isPasswordCorrect(saltedPassword, password);
            // tslint:disable-next-line: no-unused-expression
            expect(result).to.be.true;
        });
    });

});
