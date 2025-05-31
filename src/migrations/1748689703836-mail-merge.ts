import { MigrationInterface, QueryRunner } from "typeorm";

export class MailMerge1748689703836 implements MigrationInterface {
    name = 'MailMerge1748689703836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "body" character varying, "source" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "avatar" character varying, "user_id" uuid, CONSTRAINT "FK_sender_email_user" UNIQUE ("email", "user_id"), CONSTRAINT "PK_9f7a695711b2055e3c8d5cfcfa1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "logging" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "subject" character varying, "body" character varying, "status" character varying, "send_time" character varying, "total_recipients" integer, "recipients" text, CONSTRAINT "PK_2b6eefd2a39237bdb7e3545fa55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying, "key" character varying NOT NULL, "full_url" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_KEY_USER" UNIQUE ("key", "user_id"), CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3711286fc9cc4fabaf30858dc" ON "upload" ("key") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "code" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "address" character varying, "source" character varying NOT NULL, "fb_provider_id" character varying, "google_provider_id" character varying, "refresh_token" character varying, "email" character varying, "avatar" character varying, "password" character varying, "last_login" TIMESTAMP, CONSTRAINT "UQ_03b7539407e80162747960901ac" UNIQUE ("fb_provider_id"), CONSTRAINT "UQ_f78a062b8c881f271ad5523ac8b" UNIQUE ("google_provider_id"), CONSTRAINT "UQ_930cc5ae7e815ddd66d48889b2c" UNIQUE ("code", "source"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "template_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "name" character varying NOT NULL, "subject" character varying, "body" character varying, CONSTRAINT "UQ_1eeb64e229c314d1530387cc523" UNIQUE ("user_id", "name"), CONSTRAINT "PK_83f66c7249ae42d36912d8e3def" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1eeb64e229c314d1530387cc52" ON "template_entity" ("user_id", "name") `);
        await queryRunner.query(`CREATE TABLE "database" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "port" integer NOT NULL, "type" character varying NOT NULL, "host" character varying NOT NULL, "database" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_3a876646ed2427b5fd626ce1fc6" UNIQUE ("name"), CONSTRAINT "UQ_8b175106cc62980d3b9dc255984" UNIQUE ("port", "host"), CONSTRAINT "PK_ef0ad4a88bc632fd4d6a0b09ddf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipient" ADD CONSTRAINT "FK_a1c20010585ef622783c15f28e8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "logging" ADD CONSTRAINT "FK_68374361bd8c1487bdf4312ddaa" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "upload" ADD CONSTRAINT "FK_ea69a221d94b98c476875cec7d5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template_entity" ADD CONSTRAINT "FK_8f30d4dd836c5e76bf0913a3b3b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_entity" DROP CONSTRAINT "FK_8f30d4dd836c5e76bf0913a3b3b"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "FK_ea69a221d94b98c476875cec7d5"`);
        await queryRunner.query(`ALTER TABLE "logging" DROP CONSTRAINT "FK_68374361bd8c1487bdf4312ddaa"`);
        await queryRunner.query(`ALTER TABLE "recipient" DROP CONSTRAINT "FK_a1c20010585ef622783c15f28e8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"`);
        await queryRunner.query(`DROP TABLE "database"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1eeb64e229c314d1530387cc52"`);
        await queryRunner.query(`DROP TABLE "template_entity"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3711286fc9cc4fabaf30858dc"`);
        await queryRunner.query(`DROP TABLE "upload"`);
        await queryRunner.query(`DROP TABLE "logging"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
