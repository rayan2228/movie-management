import { Movie } from "../models/movieSchema.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { TryCatch } from "../utils/TryCatch.js";

const createMovie = TryCatch(async (req, res) => {
  const { title, description, released_at, duration, genre, language } =
    req.body;
  // Check if all the required fields are provided
  if (
    [title, description, released_at, duration, genre, language].includes(
      undefined
    )
  ) {
    throw new ApiError(400, "All fields are required", null);
  }
  // Create a new movie
  const movie = await Movie.create({
    title,
    description,
    released_at,
    duration,
    genre,
    language,
    created_by: req.user._id,
  });
  res.status(201).json(new ApiResponse(201, "Movie created", movie));
});

const getMovies = TryCatch(async (req, res) => {
  const movies = await Movie.find().select(
    "-__v -createdAt -updatedAt -created_by -total_rating  -avg_rating"
  );
  res.status(200).json(new ApiResponse(200, "Movies list", movies));
});

const getMovie = TryCatch(async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate(
    "created_by",
    "displayname username email avatar"
  );
  if (!movie) {
    throw new ApiError(404, "Movie not found", null);
  }
  res.status(200).json(new ApiResponse(200, "Movie found", movie));
});

const getMoviesByUser = TryCatch(async (req, res) => {
  const movies = await Movie.find({ created_by: req.user._id }).populate(
    "created_by",
    "-_id displayname username email avatar"
  );
  res.status(200).json(new ApiResponse(200, "Movies list", movies));
});

export { createMovie, getMovie, getMovies, getMoviesByUser };

