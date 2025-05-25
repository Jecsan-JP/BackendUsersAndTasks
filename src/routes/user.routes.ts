import { createUser, loginUser } from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();

//Rutas CRUD de usuarios
router.post("/", createUser);
router.post("/login", loginUser);

export default router;
