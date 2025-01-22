import mongoose, { model, Schema } from "mongoose";
const roleSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    description: {
        type: String,
    },
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Permission",
        }
    ]
},{timestamps: true});

export const Role = mongoose.models.Role ||  model("Role", roleSchema);