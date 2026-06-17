import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Catch Error Trace:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Don't expose trace stacks to client in production env
  res.status(status).json({
    status: "ERROR",
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
