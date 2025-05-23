import mongoose, { Schema, Document } from 'mongoose';

export interface ICarouselItem extends Document {
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

const CarouselItemSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CarouselItem ||
  mongoose.model<ICarouselItem>('CarouselItem', CarouselItemSchema);
