import { MigrationInterface, QueryRunner } from "typeorm";

export class Upload1732726651418 implements MigrationInterface {
    name = 'Upload1732726651418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying, "key" character varying NOT NULL, "full_url" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_KEY_USER" UNIQUE ("key", "user_id"), CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3711286fc9cc4fabaf30858dc" ON "upload" ("key") `);
        await queryRunner.query(`ALTER TABLE "upload" ADD CONSTRAINT "FK_ea69a221d94b98c476875cec7d5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "FK_ea69a221d94b98c476875cec7d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3711286fc9cc4fabaf30858dc"`);
        await queryRunner.query(`DROP TABLE "upload"`);
    }

}
