import { Permission } from "../models/permissionSchema.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { TryCatch } from "../utils/TryCatch.js";

const createPermission = TryCatch(async (req, res) => {
  // Code to create a permission
  const { name, description } = req.body;
  // Check if required fields are missing
  if (!name) {
    throw new ApiError(400, "name is required");
  }
  // Check if permission already exists
  const permission = await Permission.findOne({ name });
  if (permission) {
    throw new ApiError(400, "Permission already exists");
  }
  // Create a new permission
  const newPermission = await Permission.create({ name, description });
  return res
    .status(201)
    .json(new ApiResponse(201, "Permission created", newPermission));
});

const getPermissions = TryCatch(async (req, res) => {
  // Code to get all permissions
  const permissions = await Permission.find();
  return res
    .status(200)
    .json(new ApiResponse(200, "All permissions", permissions));
});

export { createPermission, getPermissions };

