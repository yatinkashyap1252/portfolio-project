import { Schema, model } from "mongoose";
import { IEducation } from "../types";

const educationSchema = new Schema<IEducation>(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Education = model<IEducation>("Education", educationSchema);
