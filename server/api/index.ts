// Vercel serverless entrypoint.
// The Express app itself ensures a (cached) MongoDB connection per request,
// so it can be exported directly as the function handler.
import app from "../src/app/app.js";

// Safety net: log stray promise rejections instead of letting Node kill
// the function instance (surfaces as FUNCTION_INVOCATION_FAILED).
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
});

export default app;
