import ApiError from "../utils/ApiError.js";
import { TryCatch } from "../utils/TryCatch.js";

export const checkAccess = function (roles = [], permissions = []) {
  return TryCatch(async function (req, res, next) {
    const user = req.user;
    const userPermissions = user.role.permissions;
    if (permissions.length) {
      const hasPermission = permissions.some((permission) =>
        userPermissions.includes(permission)
      );
      if (!hasPermission) {
        throw new ApiError(403, "Forbidden");
      }
    }
    if (roles.length) {
      const hasRole = roles.some((role) => user.role.name === role.name);
      console.log(hasRole);

      if (!hasRole) {
        throw new ApiError(403, "Forbidden");
      }
    }
    next();
  });
};
