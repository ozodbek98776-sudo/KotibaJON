import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth'
import { successResponse } from '../utils/response'
import { AppError } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  language: z.enum(['uz', 'ru', 'en']).optional(),
  currency: z.enum(['UZS', 'USD', 'EUR', 'RUB']).optional(),
  timezone: z.string().optional(),
})

// GET /users/profile
router.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, phone: true, avatarUrl: true, plan: true, language: true, currency: true, timezone: true, createdAt: true },
    })
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'Foydalanuvchi topilmadi')
    successResponse(res, user)
  } catch (err) { next(err) }
})

// PATCH /users/profile
router.patch('/profile', async (req: AuthRequest, res, next) => {
  try {
    const body = profileSchema.parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: body as any,
      select: { id: true, email: true, name: true, phone: true, avatarUrl: true, plan: true, language: true, currency: true, timezone: true },
    })
    successResponse(res, user)
  } catch (err) { next(err) }
})

// DELETE /users/account
router.delete('/account', async (req: AuthRequest, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } })
    res.clearCookie('refreshToken')
    successResponse(res, { message: 'Hisob muvaffaqiyatli o\'chirildi' })
  } catch (err) { next(err) }
})

export { router as usersRouter }
