import { NextFunction, Request, Response } from "express";

import { bgRgb } from "ansis";

export default function Logger (req: Request, res: Response, next: NextFunction) {
  console.log(bgRgb(197, 1, 99).bold(new Date().toISOString()), bgRgb(250, 1, 125).bold(`[${req.method}] ${req.url}`));
  next();
}
