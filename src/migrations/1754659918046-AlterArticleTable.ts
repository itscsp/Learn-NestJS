import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterArticleTable1754659918046 implements MigrationInterface {
    name = 'AlterArticleTable1754659918046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" DROP DEFAULT`);
    }

}
