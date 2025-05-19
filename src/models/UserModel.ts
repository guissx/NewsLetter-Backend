import mongoose, { Document, Schema } from "mongoose";

export interface UserModel extends Document {
  name: string;
  email: string,
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});


export default mongoose.model<UserModel>("User", UserSchema);
