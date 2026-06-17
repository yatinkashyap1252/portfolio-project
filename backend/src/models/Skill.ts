import { Schema, model } from "mongoose";
import { ISkill } from "../types";

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["frontend", "backend", "state", "devops", "other"],
    },
    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Skill = model<ISkill>("Skill", skillSchema);
