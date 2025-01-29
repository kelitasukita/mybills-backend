import { Request, Response } from "express";
import { MoreThanOrEqual, getRepository } from "typeorm";
import Expense from "../../models/Expense";
import RecurrentExpense from "../../models/RecurrentExpense";


class DeleteExpenseController {

  async handle(request: Request, response: Response) {
    const repository = getRepository(Expense);

    const { id } = request.params;

    try {
        // const { description, value, installments, created_at } = await repository.findOneOrFail(id)
      const expense = await repository.findOneOrFail(id, {
        relations: [`recurrent`]
      });  

      // check if there is or not installments, and delete
      if (expense.installments !== 0 && expense.parentId.length > 5 ) {
        await repository.delete({
          parentId: expense.parentId,
          paid: false,
          created_at: MoreThanOrEqual(expense.created_at),
        });
      } else if (expense.recurrent) { 
        console.log(expense.recurrent);

        const recurrentExpenseRepository = getRepository(RecurrentExpense);
        await recurrentExpenseRepository.softDelete({
          id: expense.recurrent.id
        });

        await repository.delete({
          recurrent: expense.recurrent,
          paid: false,  
          dueDate: MoreThanOrEqual(expense.dueDate),
        });
      } else {
        await repository.delete({ id });
      }
      
      return response.json({ message: 'Expense successfully deleted.' });

    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new DeleteExpenseController();
