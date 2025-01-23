import mongoose from "mongoose";
import {
  MONGODB_DB_NAME,
  MONGODB_PASSWORD,
  MONGODB_USERNAME,
} from "../constants.js";

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.fb9gw.mongodb.net/${MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error(`Error connecting to MongoDB ${error.message}`);
  }
};

export default mongoConnect;
