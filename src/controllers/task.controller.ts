import { DatabaseError, ValidationError } from "@/errors/errors";
import { NextFunction, Request, Response } from "express";
import Task from "@/models/task.model";
import Comment from "@/models/comment.model";

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

    res.locals.data = task;
    res.locals.message = "Tarea creada correctamente";
    next();
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

    // Obtener tareas principales (parentTaskId: null)
    const mainTasks = await Task.find({ userId, parentTaskId: null }).lean();

    // Para cada tarea principal, obtener sus subtareas y comentarios
    const tasksWithSubtasksAndComments = await Promise.all(
      mainTasks.map(async (task) => {
        // Subtareas (sin comentarios)
        const subtasks = await Task.find({
          parentTaskId: task._id,
          userId,
        }).lean();
        // Comentarios solo de la tarea principal
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

    res.locals.data = tasksWithSubtasksAndComments;
    next();
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

    res.locals.data = { task, subtasks };
    res.locals.message = "Tarea obtenida correctamente";
    next();
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

    res.locals.data = task;
    res.locals.message = "Tarea actualizada correctamente";
    next();
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

    res.locals.data = null;
    res.locals.message = "Tarea y subtareas eliminadas correctamente";
    next();
  } catch (error: any) {
    next(new DatabaseError("delete", { message: error.message }));
  }
};
