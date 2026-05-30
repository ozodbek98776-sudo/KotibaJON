import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse } from '../utils/response'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

// GET /reports/weekly
router.get('/weekly', async (req: AuthRequest, res, next) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const today = new Date()

    const [tasksDone, tasksTotal, totalExpense] = await Promise.all([
      prisma.task.count({ where: { userId: req.userId, status: 'done', updatedAt: { gte: weekAgo } } }),
      prisma.task.count({ where: { userId: req.userId, createdAt: { gte: weekAgo } } }),
      prisma.transaction.aggregate({
        where: { userId: req.userId, type: 'expense', date: { gte: weekAgo } },
        _sum: { amount: true },
      }),
    ])

    successResponse(res, {
      period: { from: weekAgo, to: today },
      tasks: { done: tasksDone, total: tasksTotal, rate: tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0 },
      finance: { expense: Number(totalExpense._sum.amount) || 0 },
    })
  } catch (err) { next(err) }
})

// GET /reports/monthly
router.get('/monthly', async (req: AuthRequest, res, next) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query
    const startDate = new Date(Number(year), Number(month) - 1, 1)
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59)

    const [tasksDone, tasksTotal, income, expense, goalsActive] = await Promise.all([
      prisma.task.count({ where: { userId: req.userId, status: 'done', updatedAt: { gte: startDate, lte: endDate } } }),
      prisma.task.count({ where: { userId: req.userId, createdAt: { gte: startDate, lte: endDate } } }),
      prisma.transaction.aggregate({ where: { userId: req.userId, type: 'income', date: { gte: startDate, lte: endDate } }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { userId: req.userId, type: 'expense', date: { gte: startDate, lte: endDate } }, _sum: { amount: true } }),
      prisma.goal.count({ where: { userId: req.userId, status: 'active' } }),
    ])

    const totalIncome = Number(income._sum.amount) || 0
    const totalExpense = Number(expense._sum.amount) || 0

    successResponse(res, {
      period: { year: Number(year), month: Number(month) },
      tasks: { done: tasksDone, total: tasksTotal },
      finance: { income: totalIncome, expense: totalExpense, balance: totalIncome - totalExpense },
      goals: { active: goalsActive },
    })
  } catch (err) { next(err) }
})

export { router as reportsRouter }
