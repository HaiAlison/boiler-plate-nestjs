import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastLoginAndSender1732108947721 implements MigrationInterface {
    name = 'AddLastLoginAndSender1732108947721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sender" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "avatar" character varying, "user_id" uuid, CONSTRAINT "FK_sender_email_user" UNIQUE ("email", "user_id"), CONSTRAINT "PK_8b4c940381151ff7dfc1bc34e9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_login" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sender" ADD CONSTRAINT "FK_50cefd3ecae13e698f2f70a57a3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sender" DROP CONSTRAINT "FK_50cefd3ecae13e698f2f70a57a3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_login"`);
        await queryRunner.query(`DROP TABLE "sender"`);
    }

}
