import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,  // cloudinary url
            required: true
        },
        coverImage: {
            type: String,  // cloudinary url
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }


    },

    { timestamps: true }
)


export const User = mongoose.Model(`User`, userSchema)