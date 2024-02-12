import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { app } from "../app.js";

export const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected on Host :::`, connectionInstance?.connection.host)
        app.on(`error`, (error) => {
            console.log(`ERR: MongoDb connection failed!!!! ${error}`);

        })
    } catch (error) {
        console.log(`ERR: MongoDb connection failed!!!! ${error}`);
        process.exit(1)
    }
}
    ;