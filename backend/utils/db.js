import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // fail fast instead of hanging till Vercel kills the function
        });
        isConnected = db.connections[0].readyState === 1;
        // console.log("Mongodb Connected Successfully!");
    } catch (error) {
        // console.log(error);
        isConnected = false;
        throw error; // let the caller (server.js) know it failed
    }
}

export default connectDB