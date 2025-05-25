import { Router } from "express";
import userRoutes from "./user.routes";
import commentRoutes from "./comment.routes";
import taskRoutes from "./task.routes";
const router = Router();

// Rutas de usuarios
router.use("/users", userRoutes);
// Rutas de tareas
router.use("/tasks", taskRoutes);
// Rutas de comentarios
router.use("/comments", commentRoutes);

export default router;
