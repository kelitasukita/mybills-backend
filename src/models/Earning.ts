import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('earnings')
class Earning {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @ManyToOne(() => Earning)
  @JoinColumn({name: 'parent_id'})
  parentId: String

  @Column('varchar')
  userId: String = "117908811566542498391";
  
  @Column('varchar')
  description: String;

  @Column('decimal', { precision: 10, scale: 2 })
  value: Number

  @Column('date')
  receiptDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Earning;
