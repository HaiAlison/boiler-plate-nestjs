import { MigrationInterface, QueryRunner } from "typeorm";

export class avatar1711987612582 implements MigrationInterface {
    name = 'avatar1711987612582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
