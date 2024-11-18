import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddSomeFields1727894208455 implements MigrationInterface {
    name = 'UserAddSomeFields1727894208455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refresh_token" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "first_name" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "fb_provider_id" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_03b7539407e80162747960901ac" UNIQUE ("fb_provider_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "google_provider_id" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f78a062b8c881f271ad5523ac8b" UNIQUE ("google_provider_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_930cc5ae7e815ddd66d48889b2c" UNIQUE ("code", "source")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_930cc5ae7e815ddd66d48889b2c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f78a062b8c881f271ad5523ac8b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "google_provider_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_03b7539407e80162747960901ac"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fb_provider_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refresh_token"`);
    }

}
