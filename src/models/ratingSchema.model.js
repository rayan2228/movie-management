import mongoose, { Schema, Model } from "mongoose";

const RatingSchema = new Schema({
    value: { type: Number, required: [true, "value is required"] max: 5, min: 1 },
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

export const Rating = mongoose.models.Rating || model("Rating", RatingSchema);