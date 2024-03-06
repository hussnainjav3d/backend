import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiReponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, `Something went wrong!`)
    }
}


const registerUser = asyncHandler(async (req, res) => {

    const { username, fullName, email, password } = req.body
    console.log(username, fullName, email, password);
    if (
        [username, fullName, email, password].some(field => field ? field?.trim() === "" : true)
    ) {
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

const loginUser = asyncHandler(async (req, res) => {
    // get body
    // validate user email
    // check password
    // generate access token
    // generate refreshToken
    const { email, username, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, `Email or username is required`)
    }
    const user = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (!user) {
        throw new ApiError(404, `User not found`)
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, `Credentials are not valid`)
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)
    console.log(`email`, email)
    const options = {
        httpsOnly: true,
        secure: true
    }
    console.log(`user---`, user)
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200, {
            user, accessToken, refreshToken
        },
            `user logged in Successfully!!`
        ))
})

export { registerUser, loginUser }