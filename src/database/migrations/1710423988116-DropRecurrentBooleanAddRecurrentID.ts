import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class DropRecurrentBooleanAddRecurrentID1710423988116 implements MigrationInterface {
    name = 'DropRecurrentBooleanAddRecurrentID1710423988116 '

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('expenses', "recurrent");

        await queryRunner.addColumn(
            'expenses',
            new TableColumn({
              name: 'recurrent_expenses_id',
              type: 'uuid',
              isNullable: true,
            })
          );
    
          await queryRunner.createForeignKey(
            'expenses',
            new TableForeignKey({
              columnNames: ['recurrent_expenses_id'],
              referencedTableName: 'recurrent_expenses',
              referencedColumnNames: ['id']
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
