import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
  userId?: string
  userPlan?: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Autentifikatsiya talab qilinadi'))
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; plan: string }
    req.userId = payload.userId
    req.userPlan = payload.plan
    next()
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'Token yaroqsiz yoki muddati o\'tgan'))
  }
}

export function requirePro(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!['pro', 'premium', 'family'].includes(req.userPlan || '')) {
    return next(new AppError(403, 'UPGRADE_REQUIRED', 'Bu funksiya Pro tarif talab qiladi'))
  }
  next()
}
