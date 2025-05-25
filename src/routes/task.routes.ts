import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "@/controllers/task.controller";

const router = Router();

// Crear tarea o subtarea
router.post("/", authMiddleware, createTask);
// Obtener todas las tareas (con subtareas y comentarios)
router.get("/", authMiddleware, getTasks);
// Obtener una tarea por ID
router.get("/:id", authMiddleware, getTaskById);
// Actualizar tarea
router.put("/:id", authMiddleware, updateTask);
// Eliminar tarea
router.delete("/:id", authMiddleware, deleteTask);

export default router;
