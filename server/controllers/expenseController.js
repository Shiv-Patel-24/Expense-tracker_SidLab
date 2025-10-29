import asyncHandler from "express-async-handler";
import Expense from "../models/Expense.js";
import { validateAmount } from "../utils/validators.js";

export const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, search } = req.query;
  const query = { user: req.user._id };
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  const expenses = await Expense.find(query).sort({ date: -1 });
  res.json({ success: true, count: expenses.length, data: expenses });
});

export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to access this expense");
  }
  res.json({ success: true, data: expense });
});

export const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, description } = req.body;
  if (!title || !amount || !category || !date) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
  if (!validateAmount(amount)) {
    res.status(400);
    throw new Error("Please provide a valid amount");
  }
  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    description,
  });
  res.status(201).json({
    success: true,
    data: expense,
  });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this expense");
  }
  const { title, amount, category, date, description } = req.body;
  if (amount && !validateAmount(amount)) {
    res.status(400);
    throw new Error("Please provide a valid amount");
  }
  expense.title = title || expense.title;
  expense.amount = amount || expense.amount;
  expense.category = category || expense.category;
  expense.date = date || expense.date;
  expense.description =
    description !== undefined ? description : expense.description;
  const updatedExpense = await expense.save();
  res.json({ success: true, data: updatedExpense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this expense");
  }
  await expense.deleteOne();
  res.json({ success: true, message: "Expense deleted successfully" });
});

export const getExpenseStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const totalExpenses = await Expense.countDocuments({ user: userId });
  const totalAmount = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const categoryBreakdown = await Expense.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyBreakdown = await Expense.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  res.json({
    success: true,
    data: {
      totalExpenses,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
      categoryBreakdown,
      monthlyBreakdown,
    },
  });
});
