import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiReponse.js";

const registerUser = asyncHandler(async (req, res) => {

    const { username, fullName, email, password } = req.body
    console.log(username, fullName, email, password);
    if (
        [username, fullName, email, password].some(field => field ? field?.trim() === "" : true)
    ) {
        console.log(`its running`)
        throw new ApiError(400, "Data is not valid")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists!!")
    }
    console.log(` req?.files`, req?.files)
    const avatarLocalPath = req?.files?.avatar[0]?.path
    const coverImageLocalPath = req?.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is Required!!")
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is Required!!")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username?.toLowerCase()
    })
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while creating user!")
    }

    res.status(201).json(
        new ApiResponse(200, userCreated, "User created Successfully!")
    )
})

export { registerUser }