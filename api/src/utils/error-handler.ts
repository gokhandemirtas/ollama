import { NextFunction, Request, Response } from "express";
import { bgBlack, bgRed } from "ansis";

export default function ErrorHandler (err: any, req: Request, res: Response, next: NextFunction) {
  console.log(bgRed(`[${req.method}] ${req.url}`));
  console.log(bgBlack(err.stack));
  res.status(500).send(err.stack);
  next();
};
