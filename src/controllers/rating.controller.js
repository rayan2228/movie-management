import { Movie } from "../models/movieSchema.model.js";
import { Rating } from "../models/ratingSchema.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { TryCatch } from "../utils/TryCatch.js";

const createRating = TryCatch(async (req, res) => {
  const { value } = req.body;
  const movie = await Movie.findById(req.params.id);

  // Check if the movie exists
  if (!movie) {
    throw new ApiError(404, "Movie not found", null);
  }
  // Check if the user has already rated the movie
  if (value < 1 || value > 5) {
    throw new ApiError(400, "Rating value should be between 1 and 5", null);
  }
  // Create a new rating
  let rating = await Rating.findOne({
    movie_id: movie._id,
    user_id: req.user._id,
  });
  if (!rating) {
    rating = await Rating.create({
      value,
      movie_id: req.params.id,
      user_id: req.user._id,
    });
  } else {
    rating.value = value;
    await rating.save();
  }
  const ratings = await Rating.find({ movie_id: req.params.id });
  // Calculate the average rating
  let avg_rating = value.toFixed(2);
  if (ratings.length > 1) {
    avg_rating = (
      ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
    ).toFixed(2);
  }
  // Update the movie with the new rating
  const updatedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      total_rating: ratings.length,
      avg_rating,
    },
    {
      new: true,
      timestamps: false,
    }
  ).populate("created_by", "displayname username email avatar");
  res.status(201).json(new ApiResponse(201, "Rating created", updatedMovie));
});

export { createRating };

