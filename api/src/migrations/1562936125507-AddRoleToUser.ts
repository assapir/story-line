import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRoleToUser1562936125507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "email", "password") SELECT "id", "firstName", "lastName", "email", "password" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user"("id", "firstName", "lastName", "email", "password") SELECT "id", "firstName", "lastName", "email", "password" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

}
