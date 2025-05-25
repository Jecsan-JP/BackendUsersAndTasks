# Todo List API

## Descripción
API para la gestión de tareas, subtareas y comentarios, con autenticación JWT. Permite a los usuarios crear, editar, eliminar y visualizar tareas, así como añadir comentarios a las tareas principales.

---

## Requisitos
- Node.js >= 16
- npm >= 8
- MongoDB Atlas (o una instancia de MongoDB accesible)

---

## Instalación y ejecución local

1. **Clona el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
     ```env
     MONGODB_URI=<TU_URI_DE_MONGODB_ATLAS>
     JWT_SECRET=<TU_CLAVE_SECRETA>
     PORT=3000
     ```
   - Reemplaza `<TU_URI_DE_MONGODB_ATLAS>` y `<TU_CLAVE_SECRETA>` por tus valores reales.

4. **Ejecuta el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:3000/`

5. **Compila y ejecuta en modo producción:**
   ```bash
   npm run build
   npm start
   ```

---

## Autenticación

### Registro de usuario
- **POST** `/api/users`
- **Body:**
```json
{
  "username": "usuario1",
  "password": "miclave123"
}
```

### Login de usuario
- **POST** `/api/users/login`
- **Body:**
```json
{
  "username": "usuario1",
  "password": "miclave123"
}
```
- **Respuesta:**
```json
{
  "data": {
    "token": "<JWT_TOKEN>"
  }
}
```

---

## Tareas y Subtareas

> **Todas las rutas requieren el header:**
> `Authorization: Bearer <JWT_TOKEN>`

### Crear tarea principal
- **POST** `/api/tasks`
- **Body:**
```json
{
  "title": "Comprar víveres",
  "description": "Ir al supermercado",
  "status": "pendiente"
}
```

### Crear subtarea
- **POST** `/api/tasks`
- **Body:**
```json
{
  "title": "Comprar leche",
  "description": "No olvidar la leche",
  "status": "pendiente",
  "parentTaskId": "<id_tarea_principal>"
}
```

### Obtener todas las tareas (con subtareas y comentarios)
- **GET** `/api/tasks`
- **Query param opcional:** `status=pendiente|completada`

### Obtener una tarea por ID (y sus subtareas)
- **GET** `/api/tasks/:id`

### Actualizar tarea o subtarea
- **PUT** `/api/tasks/:id`
- **Body:**
```json
{
  "title": "Nuevo título",
  "status": "completada"
}
```

### Eliminar tarea o subtarea
- **DELETE** `/api/tasks/:id`

---

## Comentarios en tareas principales

### Crear comentario
- **POST** `/api/comments/:taskId`
- **Body:**
```json
{
  "content": "Este es un comentario"
}
```

### Obtener comentarios de una tarea principal
- **GET** `/api/comments/:taskId`

### Editar comentario
- **PUT** `/api/comments/:commentId`
- **Body:**
```json
{
  "content": "Comentario editado"
}
```

### Eliminar comentario
- **DELETE** `/api/comments/:commentId`

---

## Notas
- Todas las rutas de tareas y comentarios requieren autenticación JWT.
- Solo puedes ver y modificar tus propias tareas y comentarios.
- El estatus de una tarea principal no puede ser "completada" si alguna de sus subtareas está "pendiente".
- Los comentarios solo pueden agregarse a tareas principales.

---

## Ejemplo de uso del header de autenticación
```
Authorization: Bearer <JWT_TOKEN>
``` 