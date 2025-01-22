import mongoose from "mongoose";
import { MONGODB_URL } from "../constants.js";

const mongoConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MONGO DB ERROR",error);
  }
};

export default mongoConnect;
