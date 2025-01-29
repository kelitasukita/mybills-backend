import { addMonths } from 'date-fns';
import * as Yup from 'yup';

import Expense from '../models/Expense';
import RecurrentExpense from '../models/RecurrentExpense';
import ExpensesRepository from '../repositories/ExpensesRepository';
import RecurrentExpenseRepository, { RecurrentExpenseData } from '../repositories/RecurrentExpenseRepository';

interface Request {
  description: string;
  currency: string;
  value: number;
  automaticDebit: boolean;
  dueDate: Date;
  obs: string;
  currentInstallment: number;
  installments: number;
  paid: boolean;
  recurrent: boolean;
}

class CreateExpenseService {
  private expensesRepository: ExpensesRepository;
  private recurrentExpensesRepository: RecurrentExpenseRepository;

  constructor(repository: ExpensesRepository, recurrentRepository: RecurrentExpenseRepository) {
    this.expensesRepository = repository;
    this.recurrentExpensesRepository = recurrentRepository;
  }

  public async execute({
    description,
    currency,
    value,
    automaticDebit,
    dueDate,
    obs,
    currentInstallment,
    installments,
    paid,
    recurrent,
  }: Request): Promise<Expense[] | null> {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      currency: Yup.string().required(),
      value: Yup.number().required(),
      automaticDebit: Yup.boolean().required(),
      dueDate: Yup.date().required(),
      obs: Yup.string(),
      currentInstallment: Yup.number().integer(),
      installments: Yup.number().integer(),
      paid: Yup.boolean(),
      recurrent: Yup.boolean().required(),
    });

    schema.validate({
      description,
      currency,
      value,
      automaticDebit,
      dueDate,
      obs,
      currentInstallment,
      installments,
      paid,
      recurrent,
    }, { abortEarly: false })
      .then(() => {
        console.log('Validação bem-sucedida');
      })
      .catch((err) => {
        console.log(err.errors); // Lista todos os erros de validação
        throw Error('Validation Failed');
      });

    let recurrentExpense: RecurrentExpense | undefined;

    if(recurrent) {
      recurrentExpense = await this.createRecurrent({
        description,
        currency,
        value,
        automaticDebit,
        dueDateDay: new Date(dueDate).getDate(),
        start_at: new Date(dueDate),
      });
    }

    if (await this.expensesRepository.isDuplicated(description, value, dueDate)) {
      throw Error(`The expense ${description} with value ${value} on this date already exists`);
    }

    const expenses = [];

    if (installments > 1) {
      let monthsToAdd = 0;

      let parentId = null;

      for (let i = currentInstallment; i <= installments; ++i) {
        const expenseData = {
          description,
          currency,
          value,
          automaticDebit,
          dueDate: addMonths(new Date(dueDate), monthsToAdd++),
          obs,
          currentInstallment: i,
          installments,
          paid,
          recurrent: null,
          parentId: parentId ?? 'no'
        };

        const currentExpense = await this.expensesRepository.createExpense(expenseData);

        if (!parentId) {
          parentId = currentExpense.id;
          currentExpense.parentId = currentExpense.id;

          await this.expensesRepository.save(currentExpense);
        }

        paid = false;

        expenses.push(currentExpense);
      }
    } else {
      const expense = await this.expensesRepository.createExpense({
        description,
        currency,
        value,
        automaticDebit,
        dueDate,
        obs,
        currentInstallment,
        installments,
        paid,
        recurrent: recurrentExpense,
        parentId: 'noi'
      });

      expenses.push(expense);
    }

    return expenses;
  }

  private async createRecurrent(recurrentData: RecurrentExpenseData): Promise<RecurrentExpense>
  {
    const recurrentExpense = await this.recurrentExpensesRepository.createRecurrentExpense(recurrentData);

    return recurrentExpense;
  }
}

export default CreateExpenseService;
