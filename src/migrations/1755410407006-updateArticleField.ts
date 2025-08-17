import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleField1755410407006 implements MigrationInterface {
    name = 'UpdateArticleField1755410407006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "favoriteContent" TO "favoriteCount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "favoriteCount" TO "favoriteContent"`);
    }

}
