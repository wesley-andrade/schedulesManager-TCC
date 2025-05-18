import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssueCode } from "zod";
import { ValidationErrorDetail } from "../types";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    const details: ValidationErrorDetail[] = err.issues.map((issue) => {
      const field = issue.path.join(".") || "<root>";
      const errorType = issue.code;
      const message = issue.message;

      const detail: ValidationErrorDetail = {
        field,
        errorType,
        message,
      };

      if (issue.code === ZodIssueCode.invalid_type) {
        detail.expected = issue.expected;
        detail.received = issue.received;
      }

      return detail;
    });

    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Falha na validação dos dados enviados",
        details,
      },
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
    },
  });
  return;
}
