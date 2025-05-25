import bcrypt from "bcrypt";
import { DatabaseError } from "@/errors/errors";
import { ValidationError } from "@/errors/errors";
import { Request, Response, NextFunction } from "express";
import User from "@/models/user.model";
import { generateToken } from "@/utils/jwt.util";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Validar que no exista el usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(
        new ValidationError({
          message: "El usuario ya existe",
          field: "username",
        })
      );
    }

    // Encriptar el password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear y guardar el usuario
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json(user);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      next(
        new ValidationError({
          message: error.message,
          field: Object.keys(error.errors)[0],
        })
      );
    } else {
      // Para cualquier error de MongoDB, usamos DatabaseError
      next(
        new DatabaseError("create", {
          message: error.message,
        })
      );
    }
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password"); // No mostrar password
    res.json(users);
  } catch (error: any) {
    next(new DatabaseError("find", { message: error.message }));
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(
        new ValidationError({ message: "Usuario no encontrado", field: "id" })
      );
    }
    res.json(user);
  } catch (error: any) {
    next(new DatabaseError("findById", { message: error.message }));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");
    if (!user) {
      return next(
        new ValidationError({ message: "Usuario no encontrado", field: "id" })
      );
    }
    res.json(user);
  } catch (error: any) {
    next(new DatabaseError("update", { message: error.message }));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return next(
        new ValidationError({ message: "Usuario no encontrado", field: "id" })
      );
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    next(new DatabaseError("delete", { message: error.message }));
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      return next(
        new ValidationError({ message: "Usuario o contraseña incorrectos" })
      );
    }

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(
        new ValidationError({ message: "Usuario o contraseña incorrectos" })
      );
    }

    const token = generateToken(
      { userId: user._id, username: user.username },
      "1h"
    );
    res.json({ token });
  } catch (error: any) {
    next(error);
  }
};
