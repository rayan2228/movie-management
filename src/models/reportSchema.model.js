import mongoose, { Schema, model } from "mongoose";

const ReportSchema = new Schema(
  {
    reason: { type: String, required: [true, "reason is required"] },
    description: { type: String, required: [true, "description is required"] },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAccepted: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.models.Report || model("Report", ReportSchema);
