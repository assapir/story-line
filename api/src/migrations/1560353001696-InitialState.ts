import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialState1560353001696 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "story" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar, "storyId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar, "storyId" varchar, CONSTRAINT "FK_992ad5bdd435b87037a6b7ab0d6" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f46f34389adcb462adf445c3375" FOREIGN KEY ("storyId") REFERENCES "story" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "line"`);
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`ALTER TABLE "temporary_line" RENAME TO "line"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "line" RENAME TO "temporary_line"`);
        await queryRunner.query(`CREATE TABLE "line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar, "storyId" varchar)`);
        await queryRunner.query(`INSERT INTO "line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "temporary_line"`);
        await queryRunner.query(`DROP TABLE "temporary_line"`);
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "story"`);
    }

}
