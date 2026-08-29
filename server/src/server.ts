import "dotenv/config";
// Type-only import (erased at compile time). It also lets Vercel's Express
// framework detection recognize this file as the entrypoint — it scans
// entrypoint candidates for an express import.
import type { Express } from "express";
import app from "./app/app.js";
import connectDB from "./app/db/config-cached.js"; // Use the cached connection version

// Safety net: log stray promise rejections instead of letting Node
// terminate the process.
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
});

// Warm up the connection eagerly; the app also awaits it per request,
// so a failure here must not crash the process via unhandled rejection.
connectDB().catch((err) => {
    console.error("Initial MongoDB connection failed:", err);
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
