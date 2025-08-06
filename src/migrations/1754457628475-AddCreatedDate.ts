import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedDate1754457628475 implements MigrationInterface {
    name = 'AddCreatedDate1754457628475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "createAt"`);
    }

}
