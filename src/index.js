import dotenv from "dotenv"
import { connectDb } from "./db/index.js";
import { app } from "./app.js";


dotenv.config({ path: './env' })
const PORT = process.env.PORT || 9000
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is connected Successfully on PORT ${PORT}`);
        })
    })
    .catch(err => console.log(`Mongo DB connection failed!!!`))





// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on(`error`, (error) => {
//             console.log(`ERR: `, error)
//             throw error
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`server is listen on PORT: ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log(`ERR: `, error)
//     }
// })()