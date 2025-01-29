import { EntityRepository, Repository } from "typeorm";

import RecurrentExpense from "../models/RecurrentExpense";

export interface RecurrentExpenseData {
  description: string;
  currency: string;
  value: number;
  automaticDebit: boolean;
  dueDateDay: number;
  start_at: Date;
  end_at?: Date;
}

@EntityRepository(RecurrentExpense)
class RecurrentExpenseRepository extends Repository<RecurrentExpense> {
  public async createRecurrentExpense(data: RecurrentExpenseData): Promise<RecurrentExpense> {
    const recurrentExpense = this.create(data);

    return await this.save(recurrentExpense);
  }

  public async allRecurrents(): Promise<RecurrentExpense[] | undefined> {
    const allRecurrentExpenses = await this.find({
      select: [
        "id",
        "description",
        "currency",
        "value",
        "dueDateDay",
        "start_at",
        "end_at"
      ],
      order: {
        start_at: "DESC",
        dueDateDay: "ASC",
      },
    });

    return allRecurrentExpenses;
  }
}

export default RecurrentExpenseRepository;
