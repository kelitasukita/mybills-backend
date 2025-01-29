import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("recurrent_expenses")
class RecurrentExpense {
  @PrimaryGeneratedColumn("uuid")
  id: String;

  @Column("varchar")
  userId: String = "117908811566542498391";

  @Column("varchar")
  description: String;

  @Column('boolean')
  automaticDebit: boolean;

  @Column("integer")
  dueDateDay: Number;

  @Column('varchar')
  currency: String;

  @Column("decimal", { precision: 10, scale: 2 })
  value: Number;

  @Column("date")
  start_at: Date;

  @Column("date")
  end_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

}

export default RecurrentExpense;
