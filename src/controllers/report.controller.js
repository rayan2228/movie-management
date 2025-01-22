import Report from "../models/reportSchema.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { TryCatch } from "../utils/TryCatch.js";
const createReport = TryCatch(async (req, res) => {
  const { reason, description } = req.body;
  // Check if all the required fields are provided
  if ([reason, description].includes(undefined)) {
    throw new ApiError(400, "All fields are required", null);
  }
  // Create a new report
  const report = await Report.create({
    reason,
    description,
    movie_id: req.params.id,
    user_id: req.user._id,
  });
  res.status(201).json(new ApiResponse(201, "Report created", report));
});

const getReports = TryCatch(async (req, res) => {
  const reports = await Report.find()
    .populate("movie_id", "title")
    .populate("user_id", "displayname username email avatar");
  res.status(200).json(new ApiResponse(200, "Reports list", reports));
});

const updateReport = TryCatch(async (req, res) => {
  const { isAccepted } = req.body;
  // Check if all the required fields are provided
  if ([isAccepted].includes(undefined)) {
    throw new ApiError(400, "All fields are required", null);
  }
  const report = await Report.findById(req.params.id);
  if (!report) {
    throw new ApiError(404, "Report not found", null);
  }
  report.isAccepted = isAccepted;
  await report.save();
  res.status(200).json(new ApiResponse(200, "Report updated", report));
});

export { createReport, getReports, updateReport };
