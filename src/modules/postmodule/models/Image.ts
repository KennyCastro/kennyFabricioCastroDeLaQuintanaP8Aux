import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  path: string;
  relativepath: string;
  filename: string;
  timestamp: Date;
}
const imgSchema: Schema = new Schema({
  path: { type: String },
  relativepath: { type: String },
  filename: { type: String },
  timestamp: { type: Date, default: Date.now() },
});
export default mongoose.model<IImage>("Image", imgSchema);
