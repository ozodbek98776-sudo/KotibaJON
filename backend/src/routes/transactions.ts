import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse, paginateQuery } from '../utils/response'
import { AppError } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  currency: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  description: z.string().max(255).optional(),
  date: z.string().optional(),
  isRecurring: z.boolean().optional(),
})

router.use(authenticate)

// GET /transactions
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', type, category, from, to } = req.query
    const p = parseInt(page as string)
    const l = Math.min(parseInt(limit as string), 100)

    const where: any = { userId: req.userId }
    if (type) where.type = type
    if (category) where.categoryId = category
    if (from || to) where.date = {}
    if (from) where.date.gte = new Date(from as string)
    if (to) where.date.lte = new Date(to as string)

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        include: { category: true },
        ...paginateQuery(p, l),
      }),
      prisma.transaction.count({ where }),
    ])

    successResponse(res, transactions, { page: p, total, per_page: l })
  } catch (err) {
    next(err)
  }
})

// GET /transactions/summary
router.get('/summary', async (req: AuthRequest, res, next) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query

    const startDate = new Date(Number(year), Number(month) - 1, 1)
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59)

    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: req.userId, type: 'income', date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId: req.userId, type: 'expense', date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      }),
    ])

    const totalIncome = Number(income._sum.amount) || 0
    const totalExpense = Number(expense._sum.amount) || 0

    successResponse(res, {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      period: { year: Number(year), month: Number(month) },
    })
  } catch (err) {
    next(err)
  }
})

// POST /transactions
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const body = transactionSchema.parse(req.body)
    const transaction = await prisma.transaction.create({
      data: {
        ...body,
        userId: req.userId!,
        amount: body.amount,
        date: body.date ? new Date(body.date) : new Date(),
        type: body.type as any,
      },
      include: { category: true },
    })
    successResponse(res, transaction, undefined, 201)
  } catch (err) {
    next(err)
  }
})

// PATCH /transactions/:id
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.transaction.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Yozuv topilmadi')

    const body = transactionSchema.partial().parse(req.body)
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: { ...body, date: body.date ? new Date(body.date) : undefined },
      include: { category: true },
    })
    successResponse(res, transaction)
  } catch (err) {
    next(err)
  }
})

// DELETE /transactions/:id
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.transaction.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Yozuv topilmadi')
    await prisma.transaction.delete({ where: { id: req.params.id } })
    successResponse(res, { message: 'Yozuv o\'chirildi' })
  } catch (err) {
    next(err)
  }
})

export { router as transactionsRouter }
