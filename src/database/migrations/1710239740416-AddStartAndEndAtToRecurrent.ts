import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStartAndEndAtToRecurrent1710239740416 implements MigrationInterface {
    name = 'AddStartAndEndAtToRecurrent1710239740416'

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.addColumn(
                'recurrent_expenses',
                new TableColumn({
                    name: 'start_at',
                    type: 'date',
                    isNullable: false,
                })
    
            );
            await queryRunner.addColumn(
                'recurrent_expenses',
                new TableColumn({
                    name: 'end_at',
                    type: 'date',
                    isNullable: true,
                })
        
            );

        }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
