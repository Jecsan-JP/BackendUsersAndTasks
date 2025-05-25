import dotenv from "dotenv";
import { createExpressApp } from "./config/express";
import { connectDB } from "./config/database";

//Cargar variables de entorno
dotenv.config();

//Conectar a la base de datos
connectDB();
//Crear la aplicación Express
const app = createExpressApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
