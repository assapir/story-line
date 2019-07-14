import { expect } from "chai";
import { describe, it } from "mocha";
import UnauthorizedException from "../../src/exceptions/unauthorizedException";

describe(`UnauthorizedException`, () => {
    it(`should set statusCode to 401`, () => {
        const exception = new UnauthorizedException();
        expect(exception.statusCode).to.be.equal(401);
    });

    it(`should set default message to 'Not Found'`, () => {
        const exception = new UnauthorizedException();
        expect(exception.message).to.be.equal(`Unauthorized`);
    });

    it(`should set message to the passed parameter`, () => {
        const exception = new UnauthorizedException(`This is very bad!`);
        expect(exception.message).to.be.equal(`This is very bad!`);
    });

    it(`should set name to 'UnauthorizedException'`, () => {
        const exception = new UnauthorizedException();
        expect(exception.name).to.be.equal(`UnauthorizedException`);
    });
});
