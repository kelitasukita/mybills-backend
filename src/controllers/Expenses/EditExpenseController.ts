import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import ExpenseRepository from "../../repositories/ExpensesRepository";
import UpdateExpenseService from "../../services/UpdateExpenseService";

class EditExpenseController {

  async handle(request: Request, response: Response) {

    const {
      description,
      currency,
      value,
      automaticDebit,
      dueDate,
      obs,
      currentInstallment,
      installments,
      paid,
      recurrent
    } = request.body;

    const id = request.params.id;

    const repository = getCustomRepository(ExpenseRepository);

    const service = new UpdateExpenseService(repository);

    const dadosParaEdicao = {
      description,
      currency,
      value,
      automaticDebit,
      dueDate,
      obs,
      currentInstallment,
      installments,
      paid,
      recurrent: !recurrent ? null : recurrent
    };
    try {
      const executionResponse = await service.execute(id, dadosParaEdicao);
      return response.json(executionResponse);
    } catch(error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new EditExpenseController();

