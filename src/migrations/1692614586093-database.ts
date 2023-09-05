import { MigrationInterface, QueryRunner } from "typeorm";

export class database1692614586093 implements MigrationInterface {
    name = 'database1692614586093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "database" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "port" integer NOT NULL, "type" character varying NOT NULL, "host" character varying NOT NULL, "database" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_8b175106cc62980d3b9dc255984" UNIQUE ("port", "host"), CONSTRAINT "PK_ef0ad4a88bc632fd4d6a0b09ddf" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "database"`);
    }

}
