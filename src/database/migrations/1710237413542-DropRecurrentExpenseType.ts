import { MigrationInterface, QueryRunner } from "typeorm";

export class DropRecurrentExpenseType1710237413542 implements MigrationInterface {
    name = 'DropRecurrentExpenseType1710237413542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableName = "recurrent_expenses";
        const columnName = "expenseTypeId";

        const foreignKeyName = await this.getForeignKeyName(queryRunner, tableName, columnName);

        if (foreignKeyName) {
            await queryRunner.dropForeignKey(tableName, foreignKeyName);
        }

        await queryRunner.dropColumns(tableName,
          ["expenseTypeId", "dueDateMonth", "obs"]
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
      }

      private async getForeignKeyName(queryRunner: QueryRunner, tableName: string, columnName: string): Promise<string | null> {
        const schema = await queryRunner.getTable(tableName);
        if (schema) {
            const foreignKey = schema.foreignKeys.find(fk => {
                return fk.columnNames.indexOf(columnName) !== -1;
            });
    
            if (foreignKey) {
                return foreignKey.name ?? null;
            }
        }
    
        return null;
      }

}
