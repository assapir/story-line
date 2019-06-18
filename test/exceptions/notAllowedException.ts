import { expect } from "chai";
import { describe, it } from "mocha";
import NotAllowedException from "../../src/exceptions/notAllowedException";

describe(`NotAllowedException`, () => {
    it(`should set statusCode to 403`, () => {
        const exception = new NotAllowedException();
        expect(exception.statusCode).to.be.equal(403);
    });

    it(`should set default message to 'Forbidden'`, () => {
        const exception = new NotAllowedException();
        expect(exception.message).to.be.equal(`Forbidden`);
    });

    it(`should set message to the passed parameter`, () => {
        const exception = new NotAllowedException(`This is very bad!`);
        expect(exception.message).to.be.equal(`This is very bad!`);
    });

    it(`should set name to 'NotAllowedException'`, () => {
        const exception = new NotAllowedException();
        expect(exception.name).to.be.equal(`NotAllowedException`);
    });
});
