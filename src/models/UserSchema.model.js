import mongoose, { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { emailValidator, passwordValidator } from "../utils/validator.js";
import { ACCESS_TOKEN_EXPIRE, ACCESS_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRE, REFRESH_TOKEN_SIGNATURE, VERIFICATION_TOKEN_EXPIRE, VERIFICATION_TOKEN_SIGNATURE } from "../constants.js";
import { TryCatch } from "../utils/TryCatch.js";

const UserSchema = new Schema({
    displayname: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "username is required"],
        lowercase: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: emailValidator,
            message: "invalid email address"
        }
    },
    password: {
        type: String,
        required: [true, "password is required"],
        validate: {
            validator: passwordValidator,
            message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
        }
    },
    avatar: {
        publicId: String,
        url: String
    },
    role: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    emailVerified: Date,
    refreshToken: String

}, { timestamps: true });

userSchema.pre("save", TryCatch(
    async function (next) {
        if (!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
))

userSchema.methods.isPasswordCorrect = TryCatch(async function (password) {
    return await bcrypt.compare(password, this.password);
})

userSchema.methods.mailVerificationToken = TryCatch(function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    }, VERIFICATION_TOKEN_SIGNATURE, { expiresIn: VERIFICATION_TOKEN_EXPIRE })
})

userSchema.methods.accessTokenGenerate = TryCatch(function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role
    }, ACCESS_TOKEN_SIGNATURE, { expiresIn: ACCESS_TOKEN_EXPIRE })
})

userSchema.methods.refreshTokenGenerate = TryCatch(function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role
    }, REFRESH_TOKEN_SIGNATURE, { expiresIn: REFRESH_TOKEN_EXPIRE })
})


export const User = mongoose.models.User || model("User", UserSchema);