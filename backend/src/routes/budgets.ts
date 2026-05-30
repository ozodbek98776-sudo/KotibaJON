import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse } from '../utils/response'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

const budgetSchema = z.object({
  categoryId: z.string().uuid().optional(),
  amount: z.number().positive(),
  period: z.enum(['monthly', 'yearly']).optional(),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2024).max(2100),
})

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId, year: Number(year) },
      include: { category: true },
    })
    successResponse(res, budgets)
  } catch (err) { next(err) }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const body = budgetSchema.parse(req.body)
    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: req.userId!,
          categoryId: body.categoryId || null as any,
          month: body.month || null as any,
          year: body.year,
        },
      },
      create: { ...body, userId: req.userId!, period: (body.period || 'monthly') as any },
      update: { amount: body.amount },
      include: { category: true },
    })
    successResponse(res, budget, undefined, 201)
  } catch (err) { next(err) }
})

export { router as budgetsRouter }
