import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEager1560420228537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar, "storyId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "line"`);
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`ALTER TABLE "temporary_line" RENAME TO "line"`);
        await queryRunner.query(`CREATE TABLE "temporary_line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar NOT NULL, "storyId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "line"`);
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`ALTER TABLE "temporary_line" RENAME TO "line"`);
        await queryRunner.query(`CREATE TABLE "temporary_line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar NOT NULL, "storyId" varchar NOT NULL, CONSTRAINT "FK_992ad5bdd435b87037a6b7ab0d6" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f46f34389adcb462adf445c3375" FOREIGN KEY ("storyId") REFERENCES "story" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "line"`);
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`ALTER TABLE "temporary_line" RENAME TO "line"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "line" RENAME TO "temporary_line"`);
        await queryRunner.query(`CREATE TABLE "line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar NOT NULL, "storyId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "temporary_line"`);
        await queryRunner.query(`DROP TABLE "temporary_line"`);
        await queryRunner.query(`ALTER TABLE "line" RENAME TO "temporary_line"`);
        await queryRunner.query(`CREATE TABLE "line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar, "storyId" varchar)`);
        await queryRunner.query(`INSERT INTO "line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "temporary_line"`);
        await queryRunner.query(`DROP TABLE "temporary_line"`);
        await queryRunner.query(`ALTER TABLE "line" RENAME TO "temporary_line"`);
        await queryRunner.query(`CREATE TABLE "line" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar, "storyId" varchar, CONSTRAINT "FK_992ad5bdd435b87037a6b7ab0d6" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "line"("id", "text", "userId", "storyId") SELECT "id", "text", "userId", "storyId" FROM "temporary_line"`);
        await queryRunner.query(`DROP TABLE "temporary_line"`);
    }

}
