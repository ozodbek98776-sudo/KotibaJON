import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { successResponse } from '../utils/response'
import { AppError } from '../middleware/errorHandler'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  language: z.enum(['uz', 'ru', 'en']).optional(),
  currency: z.enum(['UZS', 'USD', 'EUR', 'RUB']).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

function generateTokens(userId: string, plan: string) {
  const accessToken = jwt.sign(
    { userId, plan },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '30d' }
  )
  return { accessToken, refreshToken }
}

// POST /auth/register
router.post('/register', async (req: Request, res: Response, next) => {
  try {
    const body = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) throw new AppError(409, 'EMAIL_EXISTS', 'Bu email allaqachon ro\'yxatdan o\'tgan')

    const passwordHash = await bcrypt.hash(body.password, 12)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        passwordHash,
        language: (body.language || 'uz') as any,
        currency: (body.currency || 'UZS') as any,
      },
      select: { id: true, email: true, name: true, plan: true, language: true, currency: true },
    })

    const { accessToken, refreshToken } = generateTokens(user.id, user.plan)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    })

    successResponse(res, { user, accessToken }, undefined, 201)
  } catch (err) {
    next(err)
  }
})

// POST /auth/login
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email yoki parol noto\'g\'ri')
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email yoki parol noto\'g\'ri')

    const { accessToken, refreshToken } = generateTokens(user.id, user.plan)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    })

    const { passwordHash: _, ...userSafe } = user
    successResponse(res, { user: userSafe, accessToken })
  } catch (err) {
    next(err)
  }
})

// POST /auth/logout
router.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.clearCookie('refreshToken')
    successResponse(res, { message: 'Muvaffaqiyatli chiqildi' })
  } catch (err) {
    next(err)
  }
})

// GET /auth/me
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, phone: true, avatarUrl: true, plan: true, language: true, currency: true, timezone: true, createdAt: true },
    })
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'Foydalanuvchi topilmadi')
    successResponse(res, user)
  } catch (err) {
    next(err)
  }
})

export { router as authRouter }
