import { Request, Response, NextFunction } from "express";

import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
} from "@/errors/errors";
import mongoose from "mongoose";
import { BaseResponse } from "@/utils/response.util";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Si el error ya es una instancia de nuestros errores personalizados
  if (
    err instanceof ValidationError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof DatabaseError ||
    err instanceof InternalServerError ||
    err instanceof ServiceUnavailableError ||
    err instanceof TooManyRequestsError
  ) {
    const response = new BaseResponse().setError(err).build();

    return res.status(response.headers.code).json(response);
  }

  // Si es un error de validación de Mongoose
  if (err.name === "ValidationError") {
    const mongooseError = err as mongoose.Error.ValidationError;
    console.error("Error de Mongoose:", mongooseError);
    const response = new BaseResponse()
      .setError(
        new ValidationError({
          message: mongooseError.message,
          field: mongooseError.errors
            ? Object.keys(mongooseError.errors)[0]
            : undefined,
        })
      )
      .build();

    return res.status(response.headers.code).json(response);
  }

  // Para cualquier otro error no manejado
  console.error("Error no manejado:", err);
  const response = new BaseResponse()
    .setError(new InternalServerError(err.message))
    .build();

  return res.status(response.headers.code).json(response);
};
