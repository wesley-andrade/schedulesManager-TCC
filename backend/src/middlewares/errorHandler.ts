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

  if (
    typeof err === "object" &&
    err !== null &&
    (err as any).code === "P2002"
  ) {
    const target = (err as any).meta?.target?.[0] || "campo único";
    res.status(400).json({
      message: `Já existe um registro com este valor para o campo ${target}`,
    });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    (err as any).code === "P2025"
  ) {
    res.status(404).json({ message: "Registro não encontrado" });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    (err as any).code === "P2003"
  ) {
    res.status(400).json({
      message: "Referência inválida: o registro relacionado não existe",
    });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    (err as any).code === "P2011"
  ) {
    res.status(400).json({ message: "Campo obrigatório não pode ser nulo" });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    ["P2004", "P2005", "P2006"].includes((err as any).code)
  ) {
    res.status(400).json({ message: "Valor inválido para o campo" });
    return;
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
