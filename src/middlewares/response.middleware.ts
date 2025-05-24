import { Request, Response, NextFunction } from "express";
import { BaseResponse } from "../utils/response.util";

export const responseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Guardamos la función original de res.json
  const originalJson = res.json;

  res.json = function (body: any) {
    // Si la respuesta ya tiene headers (es un error), no la formateamos
    if (body && body.headers) {
      return originalJson.call(this, body);
    }

    // Si no, la formateamos como respuesta exitosa
    const response = new BaseResponse(body).build();
    return originalJson.call(this, response);
  };

  next();
};
