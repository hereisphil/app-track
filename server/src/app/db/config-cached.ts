import mongoose from "mongoose";

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/app_track";

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env",
    );
}

// Global scope to cache the connection across invocations in serverless
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

// Redact credentials so connection strings never end up in logs
const safeUri = MONGODB_URI.replace(/\/\/[^@]+@/, "//***:***@");

// Mongoose emits 'error' events for connection problems that happen after
// (or outside) the connect() promise. Without a listener, Node treats the
// event as fatal and kills the process — which surfaces on Vercel as
// FUNCTION_INVOCATION_FAILED.
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log(
                    `New MongoDB connection established at ${safeUri}`,
                );
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
