import mongoose, { Schema, model } from "mongoose";
const MovieSchema = new Schema({
    title: { type: String, required: [true, "title is required"] },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    released_at: {
        type: Date,
        required: [true, "release date is required"],
    },
    duration: {
        type: String,
        required: [true, "duration is required"],
    },
    genre: {
        type: [String],
        required: [true, "genre is required"],
    },
    language: {
        type: String,
        required: [true, "language is required"],
    },
    avg_rating: { type: Number, default: 0 },
    total_rating: { type: Number, default: 0 },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Movie = mongoose.models.Movie || model("Movie", MovieSchema);