import mongoose, { Schema, model } from "mongoose";

const ReportSchema = new Schema({
    reason: { type: String, required: true },
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

export const Report = mongoose.models.Report || model("Report", ReportSchema);