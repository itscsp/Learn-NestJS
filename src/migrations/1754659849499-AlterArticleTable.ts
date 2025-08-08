import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterArticleTable1754659849499 implements MigrationInterface {
    name = 'AlterArticleTable1754659849499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" DROP DEFAULT`);
    }

}
