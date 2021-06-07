import mongoose, { Schema, Document } from "mongoose";
export interface IPost extends Document {
  title: string;
  url: string;
  content: string;
  image: string;
  createAt: Date;
  updateAt: Date;
}
const postSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date },
});
export default mongoose.model<IPost>("Post", postSchema);
