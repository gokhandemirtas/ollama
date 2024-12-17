import { NextFunction, Request, Response } from "express";

import { bgRgb } from "ansis";

export default function Logger (req: Request, res: Response, next: NextFunction) {
  console.log(bgRgb(112, 28, 1).bold(new Date().toISOString()), bgRgb(178, 45, 1).bold(`[${req.method}] ${req.url} ${res.statusCode}`));
  next();
}
