import mongoose, { model, Schema } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Permission =
  mongoose.models.Permission || model("Permission", permissionSchema);
