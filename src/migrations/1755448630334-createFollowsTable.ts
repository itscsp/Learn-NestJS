import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollowsTable1755448630334 implements MigrationInterface {
    name = 'CreateFollowsTable1755448630334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follow" ("id" SERIAL NOT NULL, "followId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "follow"`);
    }

}
