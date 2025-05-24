import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    //URL de conexión desde variables de entorno
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "❌ MONGO_URI no está definida en las variables de entorno"
      );
    }

    const mongoURI = process.env.MONGODB_URI;

    // Opciones de conexión
    const options = {
      // ... opciones de conexión de acuerdo a las necesidades de la aplicación
      // Usar el nuevo motor de análisis de URL
      // useNewUrlParser: true,
      // Usar el nuevo motor de descubrimiento y monitoreo de servidor
      // useUnifiedTopology: true,
      // Tiempo máximo de espera para la conexión inicial (en milisegundos)
      // connectTimeoutMS: 10000,
      // Tiempo máximo de espera para operaciones (en milisegundos)
      // socketTimeoutMS: 45000,
      // Número máximo de conexiones en el pool
      // maxPoolSize: 10,
      // Número mínimo de conexiones en el pool
      // minPoolSize: 5,
      // Reintentar la conexión si falla
      // retryWrites: true,
      // Nombre de la aplicación que se conecta (útil para monitoreo)
      // appName: 'tu-app-name'
    };

    // Conectar a MongoDB
    await mongoose.connect(mongoURI);

    // Eventos de conexión
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
