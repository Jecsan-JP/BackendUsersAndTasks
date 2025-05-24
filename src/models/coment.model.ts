import { Document, model, Schema, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
}

const CommentSchema = new Schema({
  content: { type: String, required: true },
  taskId: { type: Types.ObjectId, ref: "Task", required: true },
  userId: { type: Types.ObjectId, ref: "User3", required: true },
});

export default model<IComment & Document>("Comment", CommentSchema);
