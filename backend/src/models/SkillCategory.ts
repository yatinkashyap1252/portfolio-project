import { Schema, model } from "mongoose";
import { ISkillCategory } from "../types";

const skillCategorySchema = new Schema<ISkillCategory>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    metric: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    visualizerType: {
      type: String,
      required: true,
      enum: ["wave", "matrix", "nodes", "gauge"],
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const SkillCategoryModel = model<ISkillCategory>("SkillCategory", skillCategorySchema);
