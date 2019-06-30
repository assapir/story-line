import { expect } from "chai";
import { describe, it } from "mocha";
import BadRequestException from "../../src/exceptions/badRequestException";

describe(`BadRequestException`, () => {
    it(`should set statusCode to 400`, () => {
        const exception = new BadRequestException();
        expect(exception.statusCode).to.be.equal(400);
    });

    it(`should set default message to 'Bad Request'`, () => {
        const exception = new BadRequestException();
        expect(exception.message).to.be.equal(`Bad Request`);
    });

    it(`should set message to the passed parameter`, () => {
        const exception = new BadRequestException(`This is very bad!`);
        expect(exception.message).to.be.equal(`This is very bad!`);
    });

    it(`should set name to 'BadRequestException'`, () => {
        const exception = new BadRequestException();
        expect(exception.name).to.be.equal(`BadRequestException`);
    });
});
