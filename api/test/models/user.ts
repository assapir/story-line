import { expect } from "chai";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import User from "../../src/models/user";

describe(`User`, () => {
    describe(`createOrUpdatePassword`, () => {
        it(`should return a tuple of the salt and salted password`, async () => {
            const password = faker.hacker.phrase();
            const user = new User();
            await user.createOrUpdatePassword(password);
            expect(user.password).to.have.lengthOf(95);
            expect(user.password).not.to.equal(password);
        });

        it(`should not create the same salt or password 2 times`, async () => {
            const password0 = faker.hacker.phrase();
            const password1 = faker.hacker.phrase();
            const user0 = new User();
            const user1 = new User();
            await user0.createOrUpdatePassword(password0);
            await user1.createOrUpdatePassword(password1);
            expect(user0.password).not.to.equal(user1.password);
        });

        it(`should update the user password if there is already a password`, async () => {
            const password0 = faker.hacker.phrase();
            const password1 = faker.hacker.phrase();
            const user = new User();
            await user.createOrUpdatePassword(password0);
            const first = user.password;
            await user.createOrUpdatePassword(password1);
            expect(first).not.to.equal(user.password);
        });
    });

    describe(`isPasswordCorrect`, () => {
        let password: string;
        let user: User;

        beforeEach(async () => {
            password = faker.hacker.phrase();
            user = new User();
            await user.createOrUpdatePassword(password);
        });

        it(`should return false if the password is incorrect`, async () => {
            const result = await user.isPasswordCorrect(`not that password`);
            // tslint:disable-next-line: no-unused-expression
            expect(result).to.be.false;
        });

        it(`should return true if the password is correct`, async () => {
            const result = await user.isPasswordCorrect(password);
            // tslint:disable-next-line: no-unused-expression
            expect(result).to.be.true;
        });
    });
});
