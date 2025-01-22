import e from "express";
import { createRating } from "../controllers/rating.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = e.Router();

router.route("/movies/:id/ratings").post(auth, createRating);

export default router;