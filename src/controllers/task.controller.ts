import { DatabaseError, ValidationError } from "../errors/errors";
import { NextFunction, Request, Response } from "express";
import Task from "../models/task.model";
import Comment from "../models/comment.model";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, parentTaskId } = req.body;
    const userId = (req as any).user.userId; // Obtenido del token

    const task = new Task({
      title,
      description,
      status,
      userId,
      parentTaskId: parentTaskId || null,
    });
    await task.save();

    res.json({ task });
  } catch (error: any) {
    next(new DatabaseError("create", { message: error.message }));
  }
};

// Obtener todas las tareas y subtareas del usuario
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;
    const { status } = req.query;

    // Filtro base: tareas principales del usuario
    const filter: any = { userId, parentTaskId: null };
    if (status) filter.status = status;

    // Obtener tareas principales (con posible filtro por estatus)
    const mainTasks = await Task.find(filter).lean();

    // Para cada tarea principal, obtener sus subtareas y comentarios
    const tasksWithSubtasksAndComments = await Promise.all(
      mainTasks.map(async (task) => {
        // Subtareas (sin filtro de estatus, pero puedes agregarlo si lo necesitas)
        const subtasks = await Task.find({
          parentTaskId: task._id,
          userId,
        }).lean();
        // Comentarios de la tarea principal
        const comments = await Comment.find({
          taskId: task._id,
          userId,
        }).lean();
        return {
          ...task,
          subtasks,
          comments,
        };
      })
    );

    res.json({ tasks: tasksWithSubtasksAndComments });
  } catch (error: any) {
    next(new DatabaseError("find", { message: error.message }));
  }
};

// Obtener una tarea por ID (y sus subtareas)
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return next(new ValidationError({ message: "Tarea no encontrada" }));
    }

    // Obtener subtareas
    const subtasks = await Task.find({ parentTaskId: id, userId });

    res.json({ task, subtasks });
  } catch (error: any) {
    next(new DatabaseError("findById", { message: error.message }));
  }
};

// Actualizar tarea
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Si se quiere marcar como completada, verifica subtareas
    if (status === "completada") {
      const subtasks = await Task.find({
        parentTaskId: id,
        userId,
        status: "pendiente",
      });
      if (subtasks.length > 0) {
        return next(
          new ValidationError({
            message: "No puedes completar la tarea si hay subtareas pendientes",
          })
        );
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { title, description, status },
      { new: true }
    );
    if (!task) {
      return next(new ValidationError({ message: "Tarea no encontrada" }));
    }

    res.json({ task });
  } catch (error: any) {
    next(new DatabaseError("update", { message: error.message }));
  }
};

// Eliminar tarea
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    // Elimina la tarea principal y sus subtareas
    await Task.deleteMany({ $or: [{ _id: id }, { parentTaskId: id }], userId });

    res.json({ message: "Tarea y subtareas eliminadas correctamente" });
  } catch (error: any) {
    next(new DatabaseError("delete", { message: error.message }));
  }
};
