import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse } from '../utils/response'
import { AppError } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

const reminderSchema = z.object({
  taskId: z.string().uuid().optional(),
  remindAt: z.string().datetime(),
  channels: z.array(z.enum(['push', 'sms', 'email', 'telegram'])).optional(),
  ringtone: z.string().optional(),
})

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.userId },
      include: { task: true },
      orderBy: { remindAt: 'asc' },
    })
    successResponse(res, reminders)
  } catch (err) { next(err) }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const body = reminderSchema.parse(req.body)
    const reminder = await prisma.reminder.create({
      data: {
        ...body,
        userId: req.userId!,
        remindAt: new Date(body.remindAt),
        channels: body.channels || ['push'],
      },
    })
    successResponse(res, reminder, undefined, 201)
  } catch (err) { next(err) }
})

router.patch('/:id/snooze', async (req: AuthRequest, res, next) => {
  try {
    const { minutes } = z.object({ minutes: z.number().min(1).max(1440) }).parse(req.body)
    const existing = await prisma.reminder.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Eslatma topilmadi')

    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000)
    const reminder = await prisma.reminder.update({
      where: { id: req.params.id },
      data: { status: 'snoozed', snoozeUntil },
    })
    successResponse(res, reminder)
  } catch (err) { next(err) }
})

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.reminder.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Eslatma topilmadi')
    await prisma.reminder.delete({ where: { id: req.params.id } })
    successResponse(res, { message: 'Eslatma o\'chirildi' })
  } catch (err) { next(err) }
})

export { router as remindersRouter }
