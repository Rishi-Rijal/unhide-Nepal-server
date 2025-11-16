import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

const connectDB = async () => {
    try {
        const MONGO_URI =  process.env.ISPROD === 'true' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI
        const DB_NAME = process.env.DB_NAME;

        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);

        console.log(`MongoDB connected successfully: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;