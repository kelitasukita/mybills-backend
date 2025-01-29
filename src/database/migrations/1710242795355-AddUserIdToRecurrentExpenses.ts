import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserIdToRecurrentExpenses1710242795355 implements MigrationInterface {
    name = 'AddUserIdToRecurrentExpenses1710242795355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'recurrent_expenses',
            new TableColumn({
                name: 'userId',
                type: 'varchar',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
