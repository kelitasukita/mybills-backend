import { addMonths } from 'date-fns';
import * as Yup from 'yup';

import { MoreThanOrEqual, getRepository } from 'typeorm';
import Expense from "../models/Expense";
import RecurrentExpense from '../models/RecurrentExpense';
import ExpensesRepository from '../repositories/ExpensesRepository';

interface Request {
  description: string;
  currency: string;
  value: number;
  automaticDebit: boolean;
  dueDate: Date;
  obs: string;
  currentInstallment: bigint;
  installments: bigint;
  paid: boolean;
  recurrent: boolean;
}

class UpdateExpenseService {
  private repository: ExpensesRepository;

  constructor(expensesRepository: ExpensesRepository) {
    this.repository = expensesRepository;
  }

  public async execute(id: string, {
    description,
    currency,
    value,
    automaticDebit,
    dueDate,
    obs,
    currentInstallment,
    installments,
    paid,
  }: Request): Promise<Expense[] | null> {

    // Validação dos campos
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      currency: Yup.string().required(),
      value: Yup.number().required(),
      automaticDebit: Yup.boolean().required(),
      dueDate: Yup.date().required(),
      obs: Yup.string(),
      currentInstallment: Yup.number(),
      installments: Yup.number(),
      paid: Yup.boolean(),
    });

    if (!(await schema.isValid({ description, currency, value, automaticDebit, dueDate, obs, currentInstallment, installments, paid }))) {
      throw Error('Validation Failed')
    }

    // Validar se o registro existe no banco findOneOrFail no repository
    const expenseToBeUpdated = await this.repository.findOneOrFail(id, {
      relations: [`recurrent`]
    });

    if (expenseToBeUpdated.recurrent) {
      console.log('É uma recurrent');
      const recurrentExpenseRepository = getRepository(RecurrentExpense);

      // Atualiza Recurrent
      await recurrentExpenseRepository.update({
        id: expenseToBeUpdated.recurrent.id
      }, {
        description,
        value,
        automaticDebit,
        dueDateDay: new Date(dueDate).getDate(),
        currency,
      });

      // Deleta registros futuros não pagos de recurrent
      await this.repository.delete({
        recurrent: expenseToBeUpdated.recurrent,
        paid: false,  
        dueDate: MoreThanOrEqual(expenseToBeUpdated.dueDate),
      });
    }

    // Checar duplicados mas não checar no registro em edição
    if (await this.repository.isDuplicatedButNotMe(id, description, value, dueDate)) {
      throw Error(`The expense ${description} with value ${value} on this date already exists`);
    }

    // verificar se tem installments, se tiver, deletar todos e recriar

    const expenses = [];

    if (installments > 1 || installments != expenseToBeUpdated.installments) {
      await this.repository.delete({
        description: expenseToBeUpdated.description,
        value: expenseToBeUpdated.value,
        installments: expenseToBeUpdated.installments
      });

      var monthsToAdd = 0;
      for (let i = currentInstallment; i <= installments; ++i) {
        let currentExpense = await this.repository.createExpense({
          description,
          currency,
          value,
          automaticDebit,
          dueDate: addMonths(new Date(dueDate), monthsToAdd++),
          obs,
          currentInstallment: i,
          installments,
          paid
        });

        paid = false;

        expenses.push(currentExpense);
      }
    } else {
      await this.repository.update(id, {
        description,
        currency,
        value,
        automaticDebit,
        dueDate,
        obs,
        currentInstallment,
        installments,
        paid
      });

      const updatedExpense = await this.repository.findOne(id);
      if (updatedExpense) {
        expenses.push(updatedExpense);
      }
    }

    return expenses;
  }
}


export default UpdateExpenseService;
