import { expect } from "chai";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import UnauthorizedException from "../../src/exceptions/unauthorizedException";
import User from "../../src/models/user";
import CryptoService from "../../src/services/cryptoService";

describe(`CryptoService`, () => {
    let cryptoService: CryptoService;

    beforeEach(() => {
        cryptoService = new CryptoService();
    });

    describe(`signJWT`, () => {
        it(`should throw if the payload is invalid`, () => {
            const payLoad = {
                id: faker.random.uuid(),
                email: faker.internet.email(),
                isValid: false,
            };

            expect(() => cryptoService.signJWT(payLoad)).to.throw(UnauthorizedException);
        });

        it(`should not throw if isValid wasn't supplied`, () => {
            const payLoad = {
                id: faker.random.uuid(),
                email: faker.internet.email(),
            };

            expect(() => cryptoService.signJWT(payLoad)).to.not.throw(UnauthorizedException);
        });

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
            const result = cryptoService.verifyJWT(token);
            // tslint:disable-next-line: no-unused-expression
            expect(result.isValid).to.be.true;
            expect(result.id).to.be.equal(user.id);
            expect(result.email).to.be.equal(user.email);
        });

        it(`should get an invalid token and return false`, () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.email = faker.internet.email();

            let token = cryptoService.signJWT(user);
            token = token + `blipBlip==`; // now it's not a valid token
            const result = cryptoService.verifyJWT(token);
            // tslint:disable-next-line: no-unused-expression
            expect(result.isValid).to.be.false;
            // tslint:disable-next-line: no-unused-expression
            expect(result.email).to.be.empty;
            // tslint:disable-next-line: no-unused-expression
            expect(result.id).to.be.empty;
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
            const result = cryptoService.verifyJWT(token);
            // tslint:disable-next-line: no-unused-expression
            expect(result.isValid).to.be.false;
            // tslint:disable-next-line: no-unused-expression
            expect(result.email).to.be.empty;
            // tslint:disable-next-line: no-unused-expression
            expect(result.id).to.be.empty;
        });
    });
});
