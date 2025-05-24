export class ValidationError implements Error {
  name: string = "ValidationError";
  message: string;
  field: string | undefined;  // Cambia esto
  stack?: string;

  constructor({
    message = "Error de validación",
    field,
    stack
  }: {
    message?: string;
    field?: string;
    stack?: string;
  } = {}) {
    this.message = message;
    this.field = field;
    this.stack = stack;
  }
}

export class UnauthorizedError implements Error {
  name: string = "UnauthorizedError";
  message: string;
  stack?: string;

  constructor({ message = "No autorizado" } = {}) {
    this.message = message;
  }
}

export class ForbiddenError implements Error {
  name: string = "ForbiddenError";
  message: string;
  stack?: string;

  constructor({ message = "Acceso prohibido" } = {}) {
    this.message = message;
  }
}

export class NotFoundError implements Error {
  name: string = "NotFoundError";
  message: string;
  resource: string;
  stack?: string;

  constructor(resource: string) {
    this.resource = resource;
    this.message = `${resource} no encontrado`;
  }
}

export class ConflictError implements Error {
  name: string = "ConflictError";
  message: string;
  resource: string;
  stack?: string;

  constructor(resource: string) {
    this.resource = resource;
    this.message = `${resource} ya existe`;
  }
}

export class TooManyRequestsError implements Error {
  name: string = "TooManyRequestsError";
  message: string;
  stack?: string;

  constructor({ message = "Demasiadas peticiones" } = {}) {
    this.message = message;
  }
}

// Errores de Servidor (5xx)
export class DatabaseError implements Error {
  name: string = "DatabaseError";
  message: string;
  operation: string;
  stack?: string;

  constructor(
    operation: string,
    { message = "Error en la base de datos", stack = undefined } = {}
  ) {
    this.operation = operation;
    this.message = message;
    this.stack = stack;
  }
}

export class InternalServerError implements Error {
  name: string = "InternalServerError";
  message: string;
  stack?: string;

  constructor(errorMessage: string) {
    this.message = `Error interno del servidor: ${errorMessage}`;
  }
}

export class ServiceUnavailableError implements Error {
  name: string = "ServiceUnavailableError";
  message: string;
  stack?: string;

  constructor({ message = "Servicio no disponible" } = {}) {
    this.message = message;
  }
}
