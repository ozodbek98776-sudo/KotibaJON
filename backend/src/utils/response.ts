import { Response } from 'express'

export function successResponse(
  res: Response,
  data: unknown,
  meta?: { page?: number; total?: number; per_page?: number },
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta && { meta }),
  })
}

export function errorResponse(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    error: { code, message, details: details || null },
  })
}

export function paginateQuery(
  page: number,
  perPage: number
): { skip: number; take: number } {
  return {
    skip: (page - 1) * perPage,
    take: perPage,
  }
}
