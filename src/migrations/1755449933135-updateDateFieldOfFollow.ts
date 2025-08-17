import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDateFieldOfFollow1755449933135 implements MigrationInterface {
    name = 'UpdateDateFieldOfFollow1755449933135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" RENAME COLUMN "followId" TO "followerId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" RENAME COLUMN "followerId" TO "followId"`);
    }

}
