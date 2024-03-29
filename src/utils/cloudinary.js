import { v2 as cloudinary } from "cloudinary";
import fs from "fs"



cloudinary.config({
    cloud_name: process.env.CLOUDINAR_CLOUD_NAME,
    api_key: process.env.CLOUDINAR_API_KEY,
    api_secret: process.env.CLOUDINAR_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload
            (localFilePath, {
                resource_type: "auto"
            })
        // file has been uploaded
        console.log(`file is uploaded, ${response}`)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        // remove file if some thing went wrong while uploading file
        fs.unlinkSync(localFilePath)
    }
}

export { uploadOnCloudinary }