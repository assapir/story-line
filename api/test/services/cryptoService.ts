import { expect } from "chai";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import User from "../../src/models/user";
import CryptoService from "../../src/services/cryptoService";

describe(`CryptoService`, () => {
    let cryptoService: CryptoService;

    beforeEach(() => {
        cryptoService = new CryptoService();
    });
    describe(`createPasswordAndSalt`, () => {
        it(`should return a tuple of the salt and salted password`, async () => {
            const password = faker.hacker.phrase();
            const saltedPassword = await cryptoService.createPassword(password);
            expect(saltedPassword).to.have.lengthOf(95);
            expect(saltedPassword).not.to.equal(password);
        });

        it(`should not create the same salt or password 2 times`, async () => {
            const password0 = faker.hacker.phrase();
            const password1 = faker.hacker.phrase();
            const saltedPassword0 = await cryptoService.createPassword(password0);
            const saltedPassword1 = await cryptoService.createPassword(password1);
            expect(saltedPassword0).not.to.equal(saltedPassword1);
        });
    });

    describe(`isPasswordCorrect`, () => {
        let password: string;
        let saltedPassword: string;

        beforeEach(async () => {
            password = faker.hacker.phrase();
            saltedPassword = await cryptoService.createPassword(password);
        });

        it(`should return false if the password is incorrect`, async () => {
            const result = await cryptoService.isPasswordCorrect(saltedPassword, `not that password`);
            // tslint:disable-next-line: no-unused-expression
            expect(result).to.be.false;
        });

        it(`should return true if the password is correct`, async () => {
            const result = await cryptoService.isPasswordCorrect(saltedPassword, password);
            // tslint:disable-next-line: no-unused-expression
            expect(result).to.be.true;
        });
    });

    describe(`signJWT`, () => {
        it(`should return a signed token`, () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.email = faker.internet.email();

            const result = cryptoService.signJWT(user);
            const split = result.split(`.`);
            expect(split).to.have.lengthOf(3);

            const header = JSON.parse(Buffer.from(split[0], `base64`).toString(`binary`));
            expect(header.alg).to.equal(`HS256`);
            expect(header.typ).to.equal(`JWT`);

            const payload = JSON.parse(Buffer.from(split[1], `base64`).toString(`binary`));
            expect(payload.userId).to.equal(user.id);
            expect(payload.email).to.equal(user.email);
            expect(payload.exp - payload.iat).to.equal(3600); // expiration on 1 hour
        });
    });

    describe(`verifyJWT`, () => {
        it(`should get a valid token and return true`, () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.email = faker.internet.email();

            const token = cryptoService.signJWT(user);
            // tslint:disable-next-line: no-unused-expression
            expect(cryptoService.verifyJWT(token)).to.be.true;
        });

        it(`should get an invalid token and return false`, () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.email = faker.internet.email();

            let token = cryptoService.signJWT(user);
            token = token + `blipBlip==`; // now it's not a valid token
            // tslint:disable-next-line: no-unused-expression
            expect(cryptoService.verifyJWT(token)).to.be.false;
        });

        it(`should get an expired token and return false`, () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.email = faker.internet.email();

            let token = cryptoService.signJWT(user);
            const split = token.split(`.`);
            const payload = JSON.parse(Buffer.from(split[1], `base64`).toString(`binary`));
            payload.iat = payload.exp;
            split[1] = Buffer.from(JSON.stringify(payload)).toString(`base64`);
            token = split.join(`.`);
            // tslint:disable-next-line: no-unused-expression
            expect(cryptoService.verifyJWT(token)).to.be.false;
        });
    });
});
