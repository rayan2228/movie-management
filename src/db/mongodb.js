import mongoose from "mongoose";
import { TryCatch } from "../utils/TryCatch.js";
import { MONGODB_URL } from "../constants.js";

const mongoConnect = TryCatch(async () => {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");
});

export default mongoConnect;