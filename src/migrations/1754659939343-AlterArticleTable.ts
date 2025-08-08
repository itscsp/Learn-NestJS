import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterArticleTable1754659939343 implements MigrationInterface {
    name = 'AlterArticleTable1754659939343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "title" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "title" DROP DEFAULT`);
    }

}
