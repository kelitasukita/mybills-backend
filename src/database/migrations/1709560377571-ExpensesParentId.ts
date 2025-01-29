import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ExpensesParentId1709560377571 implements MigrationInterface {
    name = 'ExpensesParentId1709560377571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'expenses',
            new TableColumn({
                name: 'parent_id',
                type: 'varchar',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'earnings',
            new TableColumn({
                name: 'parent_id',
                type: 'varchar',
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('expenses', 'parent_id');
        await queryRunner.dropColumn('earnings', 'parent_id');
    }

}
