import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssueCode } from "zod";
import { ValidationErrorDetail } from "../types";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: "Rota não encontrada" });
}

const DUPLICATE_MESSAGES: Record<string, string> = {
  User: "Email já cadastrado",
  TimeSlot: "Já existe um intervalo de horário com esses valores",
  Schedule: "Já existe um horário cadastrado para este dia e período",
  TeacherAvailability:
    "Este horário já está marcado como disponível para este professor",
  DisciplineTeacher: "Esta disciplina já está vinculada a este professor",
  DisciplineModule: "Esta disciplina já está associada a esta turma",
  DisciplineCourse: "Esta disciplina já está associada a este curso",
  ClassSchedule: "Esta turma já tem uma aula neste horário",
  ClassScheduleRoom: "A sala já está ocupada neste horário",
  AcademicPeriod: "Já existe um período acadêmico com esse nome",
  Course: "Já existe um curso com esse nome",
  Discipline: "Já existe uma disciplina com esse nome",
};

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ZodError) {
    const details: ValidationErrorDetail[] = err.issues.map((issue) => {
      const detail: ValidationErrorDetail = {
        field: issue.path.join(".") || "<root>",
        errorType: issue.code,
        message: issue.message,
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
        message: details[0]?.message ?? "Falha na validação dos dados enviados",
        details,
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2003") {
      if (req.method === "DELETE") {
        res.status(409).json({
          message:
            "Não é possível excluir este registro, pois ele possui registros vinculados no sistema",
        });
      } else {
        res.status(400).json({
          message:
            "Operação inválida: um dos registros relacionados não existe",
        });
      }
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({
        message: "Registro não encontrado",
      });
      return;
    }

    if (err.code === "P2002") {
      const model = String(err.meta?.modelName ?? "");
      res.status(409).json({
        message:
          DUPLICATE_MESSAGES[model] ?? "Já existe um registro com este valor",
      });
      return;
    }
  }

  const httpError = err as { type?: string };

  if (httpError?.type === "entity.parse.failed") {
    res.status(400).json({ message: "JSON inválido no corpo da requisição" });
    return;
  }

  if (httpError?.type === "entity.too.large") {
    res.status(413).json({ message: "Corpo da requisição grande demais" });
    return;
  }

  console.error("[errorHandler]", err);
  res.status(500).json({ message: "Erro interno do servidor" });
}
