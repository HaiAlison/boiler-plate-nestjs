import { MigrationInterface, QueryRunner } from "typeorm";

export class Log1732987226695 implements MigrationInterface {
    name = 'Log1732987226695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logging" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "subject" character varying, "body" character varying, "status" character varying, "send_time" character varying, "total_recipients" character varying, "recipients" text, CONSTRAINT "PK_2b6eefd2a39237bdb7e3545fa55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logging" ADD CONSTRAINT "FK_68374361bd8c1487bdf4312ddaa" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logging" DROP CONSTRAINT "FK_68374361bd8c1487bdf4312ddaa"`);
        await queryRunner.query(`DROP TABLE "logging"`);
    }

}
