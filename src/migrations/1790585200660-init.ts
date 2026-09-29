import { MigrationInterface, QueryRunner } from "typeorm";

export class init1790585200660 implements MigrationInterface {
    name = 'init1790585200660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "works_on" ("essn" uuid NOT NULL, "pno" uuid NOT NULL, "hours" numeric(4,1) NOT NULL DEFAULT '0', CONSTRAINT "PK_9fda8939fbe4c2f22c7a2e4adae" PRIMARY KEY ("essn", "pno"))`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "fname" character varying NOT NULL, "minit" character varying NOT NULL, "lname" character varying NOT NULL, "bdate" TIMESTAMP WITH TIME ZONE, "address" character varying NOT NULL, "sex" character varying NOT NULL, "salary" integer NOT NULL DEFAULT '0', "dno" uuid, "supervisor" uuid, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "dname" character varying NOT NULL, "dno" integer NOT NULL, "mgrssn" uuid NOT NULL, "mgrstartdate" TIMESTAMP NOT NULL, "locations" text, CONSTRAINT "REL_bc54b54c5de88ed003a8dbb70c" UNIQUE ("mgrssn"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "works_on" ADD CONSTRAINT "FK_b91019e3add4a46fdeea4f29ec9" FOREIGN KEY ("essn") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "works_on" ADD CONSTRAINT "FK_213cd09dd63c3e4556f54f8f205" FOREIGN KEY ("pno") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_7767b8eac2a5cc3606939675b58" FOREIGN KEY ("dno") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_c4c9e40330524e23d27d2c48bc3" FOREIGN KEY ("supervisor") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "FK_bc54b54c5de88ed003a8dbb70c0" FOREIGN KEY ("mgrssn") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_bc54b54c5de88ed003a8dbb70c0"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_c4c9e40330524e23d27d2c48bc3"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_7767b8eac2a5cc3606939675b58"`);
        await queryRunner.query(`ALTER TABLE "works_on" DROP CONSTRAINT "FK_213cd09dd63c3e4556f54f8f205"`);
        await queryRunner.query(`ALTER TABLE "works_on" DROP CONSTRAINT "FK_b91019e3add4a46fdeea4f29ec9"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "works_on"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
