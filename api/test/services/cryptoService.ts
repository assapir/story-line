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
