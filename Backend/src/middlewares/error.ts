import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware  = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) : void=>{
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.name === "CastError") err.message = "Invalid ID";

   res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const TryCatch =
  (func: ControllerType) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };











