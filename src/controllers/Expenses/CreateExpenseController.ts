import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import ExpenseRepository from "../../repositories/ExpensesRepository";
import RecurrentExpenseRepository from "../../repositories/RecurrentExpenseRepository";
import CreateExpenseService from "../../services/CreateExpenseService";

class CreateExpenseController {

  async handle(request: Request, response: Response) {

    try {

      const repository = getCustomRepository(ExpenseRepository);
      const recurrentRepo = getCustomRepository(RecurrentExpenseRepository);
      const service = new CreateExpenseService(repository, recurrentRepo);

      return response.json(await service.execute(request.body));

    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export default new CreateExpenseController();
