import mongoose, { Schema, Document } from "mongoose";

export interface INewsItem extends Document {
  image: string;
  title: string;
  category: string;
  excerpt: string;
  timestamp: Date;
}

const NewsItemSchema: Schema = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.NewsItem || mongoose.model<INewsItem>("NewsItem", NewsItemSchema);

