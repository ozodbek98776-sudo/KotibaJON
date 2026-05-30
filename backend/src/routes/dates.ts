import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse } from '../utils/response'
import { AppError } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

const dateSchema = z.object({
  title: z.string().min(1).max(255),
  personName: z.string().optional(),
  date: z.string(),
  type: z.enum(['birthday', 'anniversary', 'payment', 'other']).optional(),
  remindDays: z.array(z.number()).optional(),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional(),
})

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const dates = await prisma.importantDate.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'asc' },
    })
    successResponse(res, dates)
  } catch (err) { next(err) }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const body = dateSchema.parse(req.body)
    const date = await prisma.importantDate.create({
      data: {
        ...body,
        userId: req.userId!,
        date: new Date(body.date),
        type: (body.type || 'other') as any,
        remindDays: body.remindDays || [1, 3, 7],
        isRecurring: body.isRecurring !== undefined ? body.isRecurring : true,
      },
    })
    successResponse(res, date, undefined, 201)
  } catch (err) { next(err) }
})

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.importantDate.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Sana topilmadi')
    await prisma.importantDate.delete({ where: { id: req.params.id } })
    successResponse(res, { message: 'Sana o\'chirildi' })
  } catch (err) { next(err) }
})

export { router as datesRouter }
