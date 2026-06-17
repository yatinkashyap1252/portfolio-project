import mongoose from "mongoose";
import { seedDatabase } from "./seed";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio-cms";
    await mongoose.connect(mongoURI);
    console.log("MongoDB Database Connected Successfully.");
    await seedDatabase();
  } catch (error) {
    console.error("Database connection failure:", error);
    process.exit(1);
  }
};
