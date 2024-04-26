import { MigrationInterface, QueryRunner } from "typeorm";

export class fbProviderId1711742108514 implements MigrationInterface {
    name = 'fbProviderId1711742108514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fbProviderId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_89267e5ff74bf1272c51619f3a4" UNIQUE ("fbProviderId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "database" ADD CONSTRAINT "UQ_3a876646ed2427b5fd626ce1fc6" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_930cc5ae7e815ddd66d48889b2c" UNIQUE ("code", "source")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_930cc5ae7e815ddd66d48889b2c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "code" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "database" DROP CONSTRAINT "UQ_3a876646ed2427b5fd626ce1fc6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_89267e5ff74bf1272c51619f3a4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fbProviderId"`);
    }

}
