import { expect } from "chai";
import { describe, it } from "mocha";
import NotFoundException from "../../src/exceptions/notFoundException";

describe(`NotFoundException`, () => {
    it(`should set statusCode to 404`, () => {
        const exception = new NotFoundException();
        expect(exception.statusCode).to.be.equal(404);
    });

    it(`should set default message to 'Bad Request'`, () => {
        const exception = new NotFoundException();
        expect(exception.message).to.be.equal(`Not Found`);
    });

    it(`should set message to the passed parameter`, () => {
        const exception = new NotFoundException(`This is very bad!`);
        expect(exception.message).to.be.equal(`This is very bad!`);
    });

    it(`should set name to 'BadRequestException'`, () => {
        const exception = new NotFoundException();
        expect(exception.name).to.be.equal(`NotFoundException`);
    });
});
