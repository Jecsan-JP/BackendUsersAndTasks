import { Document, model, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default model<IUser & Document>("User3", UserSchema);
