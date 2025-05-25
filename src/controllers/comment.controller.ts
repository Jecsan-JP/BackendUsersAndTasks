import { Request, Response, NextFunction } from "express";
import Comment from "@/models/comment.model";
import Task from "@/models/task.model";
import { DatabaseError, ValidationError } from "@/errors/errors";

// Crear comentario en una tarea principal
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { taskId } = req.params;
    const { content } = req.body;

    // Verifica que la tarea exista, pertenezca al usuario y sea principal
    const task = await Task.findOne({ _id: taskId, userId, parentTaskId: null });
    if (!task) {
      return next(new ValidationError({ message: "Tarea principal no encontrada" }));
    }

    const comment = new Comment({ content, taskId, userId });
    await comment.save();

    res.locals.data = comment;
    res.locals.message = "Comentario creado correctamente";
    next();
  } catch (error: any) {
    next(new DatabaseError("create", { message: error.message }));
  }
};

// Obtener comentarios de una tarea principal
export const getCommentsByTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { taskId } = req.params;

    // Verifica que la tarea exista, pertenezca al usuario y sea principal
    const task = await Task.findOne({ _id: taskId, userId, parentTaskId: null });
    if (!task) {
      return next(new ValidationError({ message: "Tarea principal no encontrada" }));
    }

    const comments = await Comment.find({ taskId, userId });
    res.locals.data = comments;
    res.locals.message = "Comentarios obtenidos correctamente";
    next();
  } catch (error: any) {
    next(new DatabaseError("find", { message: error.message }));
  }
};

// Editar comentario (solo el autor puede editar)
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, userId },
      { content },
      { new: true }
    );
    if (!comment) {
      return next(new ValidationError({ message: "Comentario no encontrado o no autorizado" }));
    }

    res.locals.data = comment;
    res.locals.message = "Comentario actualizado correctamente";
    next();
  } catch (error: any) {
    next(new DatabaseError("update", { message: error.message }));
  }
};

// Eliminar comentario (solo el autor puede eliminar)
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { commentId } = req.params;

    const comment = await Comment.findOneAndDelete({ _id: commentId, userId });
    if (!comment) {
      return next(new ValidationError({ message: "Comentario no encontrado o no autorizado" }));
    }

    res.locals.data = null;
    res.locals.message = "Comentario eliminado correctamente";
    next();
  } catch (error: any) {
    next(new DatabaseError("delete", { message: error.message }));
  }
};
