import mongoose, { Schema, Document } from "mongoose";
import { IPost } from "../../postmodule/models/Post";
export interface IUser extends Document {
  fullname: string;
  username: string;
  email: string;
  registerdate: Date;
  password: string;
  post: Array<IPost>;
}
const userSchema: Schema = new Schema({
  fullname: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  registerdate: { type: Date, required: true },
  password: { type: String, required: true },
  post: { type: Array },
});
export default mongoose.model<IUser>("User", userSchema);

/*





















import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    registerdate: Date,
    password: string
}
const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    registerdate: { type: Date, required: true },
    password: { type: String, required: true },
});
export default mongoose.model<IUser>("User", userSchema);
*/
