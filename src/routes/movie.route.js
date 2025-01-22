import e from "express";
import {
  createMovie,
  getMovie,
  getMovies,
  getMoviesByUser,
  updateMovie,
} from "../controllers/movies.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = e.Router();

router.route("/movies").get(getMovies).post(auth, createMovie);
router.route("/movies/:id").get(auth, getMovie).put(auth, updateMovie);
router.route("/users-movies/").get(auth, getMoviesByUser);
export default router;
