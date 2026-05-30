import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse, paginateQuery } from '../utils/response'
import { AppError } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

const taskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  categoryId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  parentId: z.string().uuid().optional(),
  isRecurring: z.boolean().optional(),
  recurRule: z.any().optional(),
})

router.use(authenticate)

// GET /tasks
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', status, priority, category, search } = req.query
    const p = parseInt(page as string)
    const l = Math.min(parseInt(limit as string), 100)

    const where: any = { userId: req.userId }
    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.categoryId = category
    if (search) where.title = { contains: search, mode: 'insensitive' }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
        include: { category: true, subtasks: true, reminders: true },
        ...paginateQuery(p, l),
      }),
      prisma.task.count({ where }),
    ])

    successResponse(res, tasks, { page: p, total, per_page: l })
  } catch (err) {
    next(err)
  }
})

// GET /tasks/today
router.get('/today', async (req: AuthRequest, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId,
        dueDate: { gte: today, lt: tomorrow },
        status: { not: 'cancelled' },
      },
      include: { category: true },
      orderBy: { priority: 'desc' },
    })

    successResponse(res, tasks)
  } catch (err) {
    next(err)
  }
})

// POST /tasks
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const body = taskSchema.parse(req.body)
    const task = await prisma.task.create({
      data: {
        ...body,
        userId: req.userId!,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
      include: { category: true },
    })
    successResponse(res, task, undefined, 201)
  } catch (err) {
    next(err)
  }
})

// GET /tasks/:id
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { category: true, subtasks: true, reminders: true, comments: true, files: true },
    })
    if (!task) throw new AppError(404, 'TASK_NOT_FOUND', 'Vazifa topilmadi')
    successResponse(res, task)
  } catch (err) {
    next(err)
  }
})

// PATCH /tasks/:id
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'TASK_NOT_FOUND', 'Vazifa topilmadi')

    const body = taskSchema.partial().parse(req.body)
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        completedAt: body.status === 'done' ? new Date() : undefined,
      },
      include: { category: true },
    })
    successResponse(res, task)
  } catch (err) {
    next(err)
  }
})

// PATCH /tasks/:id/status
router.patch('/:id/status', async (req: AuthRequest, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(['todo', 'in_progress', 'done', 'cancelled']) }).parse(req.body)
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'TASK_NOT_FOUND', 'Vazifa topilmadi')

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status: status as any, completedAt: status === 'done' ? new Date() : null },
    })
    successResponse(res, task)
  } catch (err) {
    next(err)
  }
})

// DELETE /tasks/:id
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new AppError(404, 'TASK_NOT_FOUND', 'Vazifa topilmadi')
    await prisma.task.delete({ where: { id: req.params.id } })
    successResponse(res, { message: 'Vazifa o\'chirildi' })
  } catch (err) {
    next(err)
  }
})

export { router as tasksRouter }
