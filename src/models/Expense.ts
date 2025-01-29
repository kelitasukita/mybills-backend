import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import ExpenseType from './ExpenseType';
import RecurrentExpense from './RecurrentExpense';

@Entity('expenses')
class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Column('varchar', {name: 'parent_id', nullable: true})
  parentId: String

  @Column('varchar')
  userId: String = "117908811566542498391";

  @ManyToOne(() => ExpenseType)
  @JoinColumn({ name: 'expense_type_id' })
  expenseType: ExpenseType;

  @Column('varchar')
  description: String;

  @Column('decimal', { precision: 10, scale: 2 })
  value: Number

  @Column('boolean')
  automaticDebit: boolean;

  @Column('date')
  dueDate: Date;

  @Column('varchar')
  obs: String;

  @Column('int')
  currentInstallment: number;

  @Column('int')
  installments: number;

  @Column('boolean')
  paid: boolean;

  @ManyToOne(() => RecurrentExpense, {nullable: true})
  @JoinColumn({ name: 'recurrent_expenses_id'})
  recurrent?: RecurrentExpense;

  @Column('boolean')
  currency: String;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  overdue: boolean = false;

  exchangedValue: number = 0;
}

export default Expense;
