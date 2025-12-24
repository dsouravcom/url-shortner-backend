import mongoose from "mongoose";
import logger from "../utils/Logger";

/**
 * Optimized MongoDB connection configuration
 */
const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error(
                "MONGO_URI is not defined in environment variables"
            );
        }

        // Mongoose connection options for optimal performance
        const options: mongoose.ConnectOptions = {
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 5, // Minimum number of connections in the pool
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            family: 4, // Use IPv4, skip trying IPv6
        };

        // Connect to MongoDB
        await mongoose.connect(mongoUri, options);

        logger.info("✅ Connected to MongoDB successfully");

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed due to app termination");
            process.exit(0);
        });

        // Set mongoose options for better performance
        mongoose.set("strictQuery", false);
        mongoose.set("autoIndex", process.env.NODE_ENV !== "production");
    } catch (error) {
        logger.error("❌ MongoDB connection failed:", error);

        // Check if it's an authentication error
        if (
            error instanceof Error &&
            error.message.includes("authentication failed")
        ) {
            logger.error(
                "Authentication failed. Please check your MongoDB credentials in .env file"
            );
            logger.error(
                "Make sure MONGO_URI has the correct username and password"
            );
            process.exit(1); // Exit instead of retrying on auth errors
        }

        // Retry connection after 5 seconds for other errors
        logger.info("Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
