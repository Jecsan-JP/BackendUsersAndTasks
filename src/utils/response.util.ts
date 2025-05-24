import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
} from "@/errors/errors";

export class BaseResponse<DATA> {
  statusCode: number = 200;
  message: string = "Proceso exitoso";
  data?: DATA;
  headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
  };

  constructor(data?: DATA) {
    this.data = data;
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setCode(code: number) {
    this.statusCode = code;
    return this;
  }

  setError(error: Error) {
    if (error instanceof ValidationError) {
      this.setCode(400); // Bad Request - Datos inválidos
      this.setMessage(error.message);
    } else if (error instanceof DatabaseError) {
      this.setCode(500); // Internal Server Error - Error en la base de datos
      this.setMessage(error.message);
    } else if (error instanceof NotFoundError) {
      this.setCode(404); // Not Found - Recurso no encontrado
      this.setMessage(error.message);
    } else if (error instanceof UnauthorizedError) {
      this.setCode(401); // Unauthorized - No autenticado
      this.setMessage(error.message);
    } else if (error instanceof ForbiddenError) {
      this.setCode(403); // Forbidden - No autorizado
      this.setMessage(error.message);
    } else if (error instanceof ConflictError) {
      this.setCode(409); // Conflict - Recurso ya existe
      this.setMessage(error.message);
    } else if (error instanceof TooManyRequestsError) {
      this.setCode(429); // Too Many Requests - Límite de peticiones
      this.setMessage(error.message);
    } else {
      this.setCode(500); // Internal Server Error - Error no manejado
      this.setMessage("Error interno del servidor");
    }
    return this;
  }

  build() {
    return {
      headers: {
        code: this.statusCode,
        message: this.message,
        version: 1.0,
      },
      data: this.data,
    };
  }
}
