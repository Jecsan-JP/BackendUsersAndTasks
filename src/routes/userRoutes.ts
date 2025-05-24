import { createUser } from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();

//Rutas CRUD de usuarios
router.post("/", createUser);

export default router;
