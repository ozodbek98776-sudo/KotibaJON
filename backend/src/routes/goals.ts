import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse } from '../utils/response'
import { AppError } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

const goalSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  targetValue: z.number().positive(),
  currentValue: z.number().min(0).optional(),
  unit: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(['active', 'completed', 'paused', 'failed']).optional(),
})

router.use(authenticate)

// GET /goals
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      include: { category: true, milestones: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
    successResponse(res, goals)
  } catch (err) {
    next(err)
  }
})

// POST /goals
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const body = goalSchema.parse(req.body)
    const goal = await prisma.goal.create({
      data: {
        ...body,
        userId: req.userId!,
        targetValue: body.targetValue,
        currentValue: body.currentValue || 0,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        status: (body.status || 'active') as any,
      },
      include: { category: true, milestones: true },
    })
    successResponse(res, goal, undefined, 201)
  } catch (err) {
    next(err)
  }
})

// PATCH /goals/:id/progress
router.patch('/:id/progress', async (req: AuthRequest, res, next) => {
  try {
    const { currentValue } = z.object({ currentValue: z.number().min(0) }).parse(req.body)
    const existing = await prisma.goal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Maqsad topilmadi')

    const isCompleted = currentValue >= Number(existing.targetValue)
    const goal = await prisma.goal.update({
      where: { id: req.params.id },
      data: {
        currentValue,
        status: isCompleted ? 'completed' : existing.status,
      },
      include: { milestones: true },
    })
    successResponse(res, goal)
  } catch (err) {
    next(err)
  }
})

// POST /goals/:id/milestones
router.post('/:id/milestones', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.goal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Maqsad topilmadi')

    const { title, order } = z.object({ title: z.string(), order: z.number().optional() }).parse(req.body)
    const milestone = await prisma.goalMilestone.create({
      data: { goalId: req.params.id, title, order: order || 0 },
    })
    successResponse(res, milestone, undefined, 201)
  } catch (err) {
    next(err)
  }
})

export { router as goalsRouter }
