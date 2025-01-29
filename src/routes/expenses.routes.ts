import { Request, Response, Router } from "express";

import axios from "axios";
import { getCustomRepository } from "typeorm";
import CreateExpenseController from "../controllers/Expenses/CreateExpenseController";
import DeleteExpenseController from "../controllers/Expenses/DeleteExpenseController";
import EditExpenseController from "../controllers/Expenses/EditExpenseController";
import GetAllExpensesController from "../controllers/Expenses/GetAllExpensesController";
import GetExpenseController from "../controllers/Expenses/GetExpenseController";
import PaidExpensesController from "../controllers/Expenses/PaidExpensesController";
import ToggleExpenseController from "../controllers/Expenses/ToggleExpenseController";
import UnpaidExpensesController from "../controllers/Expenses/UnpaidExpensesController";
import ExpenseRepository from "../repositories/ExpensesRepository";
import RecurrentExpenseRepository from "../repositories/RecurrentExpenseRepository";

const recurrentGeneratorMiddleware = async (req: Request, res: Response, next) => {
  const { year, month } = req.query;

  const recurrentExpenseRepository = getCustomRepository(RecurrentExpenseRepository);
  const allValidRecurrents = await recurrentExpenseRepository.find({
      where: {
        deleted_at: null
      }
  });

  const expenseRepository = getCustomRepository(ExpenseRepository);
  await expenseRepository.generateMissingRecurrent(year, month, allValidRecurrents);

  next();
}

const expensesRouter = Router();

expensesRouter.post("/", CreateExpenseController.handle);
expensesRouter.delete("/:id", DeleteExpenseController.handle);

expensesRouter.get("/unpaid", recurrentGeneratorMiddleware, UnpaidExpensesController.handle);

expensesRouter.get("/paid", PaidExpensesController.handle);
expensesRouter.get("/:id", GetExpenseController.handle);
expensesRouter.get("/", GetAllExpensesController.handle);
expensesRouter.put("/:id", EditExpenseController.handle);
expensesRouter.patch("/:id/toggle", ToggleExpenseController.handle);

expensesRouter.get("/test/wise", async (req, res) => {
  const response = await axios.post(`https://api.transferwise.com/v3/quotes/`, {
    targetAmount: req.query.valor,
    sourceCurrency: "EUR",
    targetCurrency: "BRL",
    preferredPayIn: "BANK_TRANSFER",
  });

  const inEuro = response.data.paymentOptions[0].sourceAmount;

  return res.json({
    brl: +req.query.valor,
    eur: inEuro,
  });
});

export default expensesRouter;
