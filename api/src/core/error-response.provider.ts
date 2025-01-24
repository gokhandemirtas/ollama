import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export function expressErrorMiddleware(error: CustomError, req: Request, res: Response, next: NextFunction) {
  const status = error.statusCode || 500;
  const message = `${error.message} zorluklar olustu`;
  res.status(status).send({ message });
  next();
}
