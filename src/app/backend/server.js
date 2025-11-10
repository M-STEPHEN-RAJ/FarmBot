import { connectDB } from "./config/db";

export const initServer = async () => {
    try {
        await connectDB();
        console.log("Server Initialized!");        
    } 
    catch (error) {
        console.error("Failed to start server!", error.message);        
    }
}