import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameSenderToRecipient1739025859301 implements MigrationInterface {
    name = 'RenameSenderToRecipient1739025859301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sender RENAME TO recipient`);    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE recipient RENAME TO sender`);
}

}
