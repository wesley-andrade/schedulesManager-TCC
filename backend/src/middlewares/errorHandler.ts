import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssueCode } from "zod";
import { ValidationErrorDetail } from "../types";
import { Prisma } from "@prisma/client";

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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2003") {
      res.status(400).json({
        message:
          "Não é possível excluir este registro pois ele possui registros vinculados no sistema",
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({
        message: "Registro não encontrado",
      });
      return;
    }

    if (err.code === "P2002") {
      res.status(400).json({
        message: "Já existe um registro com este valor",
      });
      return;
    }
  }

  if (err instanceof Error) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
    },
  });
  return;
}
