import { Document, model, Schema, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pendiente" | "completada";
  userId: Types.ObjectId;
  parentTaskId?: Types.ObjectId | null;
}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["pendiente", "completada"], required: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  parentTaskId: { type: Types.ObjectId, ref: "Task" },
});

export default model<ITask & Document>("Task", TaskSchema);
