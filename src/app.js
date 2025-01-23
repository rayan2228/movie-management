import cookieParser from "cookie-parser";
import cors from "cors";
import e from "express";
import { ORIGIN_URLS } from "./constants.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";
import { TryCatch } from "./utils/TryCatch.js";
const app = e();

app.use(e.json({ limit: "16mb" }));
app.use(e.urlencoded({ extended: true, limit: "16mb" }));
app.use(e.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: ORIGIN_URLS,
    credentials: true,
  })
);


import movieRouter from "./routes/movie.route.js";
import permissionRouter from "./routes/permission.route.js";
import ratingRouter from "./routes/rating.route.js";
import reportsRouter from "./routes/report.route.js";
import roleRouter from "./routes/role.route.js";
import userRouter from "./routes/user.route.js";
app.use("/api/v1", userRouter);
app.use("/api/v1", permissionRouter);
app.use("/api/v1", roleRouter);
app.use("/api/v1", movieRouter);
app.use("/api/v1", ratingRouter);
app.use("/api/v1", reportsRouter);

app.get(
  "/api/v1",
  TryCatch(async (req, res) => {
    return res.json(new ApiResponse(200, "Welcome to Movie API"));
  })
);

app.all(
  "*",
  TryCatch(async (req, res, next) => {
    throw new ApiError(404, "Route not found");
  })
);

app.use(errorHandler);

export default app;
