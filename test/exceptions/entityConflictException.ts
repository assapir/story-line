import { expect } from "chai";
import { describe, it } from "mocha";
import EntityConflictException from "../../src/exceptions/entityConflictException";

describe(`EntityConflictException`, () => {
    it(`should set statusCode to 409`, () => {
        const exception = new EntityConflictException();
        expect(exception.statusCode).to.be.equal(409);
    });

    it(`should set default message to 'Conflict'`, () => {
        const exception = new EntityConflictException();
        expect(exception.message).to.be.equal(`Conflict`);
    });

    it(`should set message to the passed parameter`, () => {
        const exception = new EntityConflictException(`This is very bad!`);
        expect(exception.message).to.be.equal(`This is very bad!`);
    });

    it(`should set name to 'EntityConflictException'`, () => {
        const exception = new EntityConflictException();
        expect(exception.name).to.be.equal(`EntityConflictException`);
    });
});
