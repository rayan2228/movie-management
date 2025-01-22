import { Role } from "../models/roleSchema.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { TryCatch } from "../utils/TryCatch.js";

const createRole = TryCatch(async (req, res) => {
  // Code to create a role
  const { name, description, permissions } = req.body;
  // Check if required fields are missing
  if (!name) {
    throw new ApiError(400, "name is required");
  }
  if (!permissions || permissions.length === 0) {
    throw new ApiError(400, "permissions are required");
  }
  // Check if role already exists
  const role = await Role.findOne({ name });
  if (role) {
    throw new ApiError(400, "Role already exists");
  }
  // Create a new role
  const newRole = await Role.create({ name, description, permissions });
  return res.status(201).json(new ApiResponse(201, "Role created", newRole));
});

const getRoles = TryCatch(async (req, res) => {
  // Code to get all roles
  const roles = await Role.find();
  return res.status(200).json(new ApiResponse(200, "All roles", roles));
});

export { createRole, getRoles };

