import app from "../src/app/app.js";
import connectDB from "../src/app/db/config-cached.js"; // Use the cached connection version for Vercel

// This is the Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
    // 1. Ensure DB is connected before handling the request
    await connectDB();

    // 2. Pass the request to the Express app
    // Note: We do NOT call app.listen() here.
    app(req, res);
}
