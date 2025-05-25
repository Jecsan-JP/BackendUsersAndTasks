import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment
} from "@/controllers/comment.controller";

const router = Router();

// Crear comentario en una tarea principal
router.post("/:taskId", authMiddleware, createComment);
// Obtener comentarios de una tarea principal
router.get("/:taskId", authMiddleware, getCommentsByTask);
// Editar comentario
router.put("/:commentId", authMiddleware, updateComment);
// Eliminar comentario
router.delete("/:commentId", authMiddleware, deleteComment);

export default router; 