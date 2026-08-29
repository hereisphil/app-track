import MongoStoreImport from "connect-mongo";
import cors from "cors";
import express, { type Request, type Response } from "express";
import session from "express-session";
import morgan from "morgan";
import connectDB from "./db/config-cached.js";
import routeHandler from "./routes/index.js";

// connect-mongo ships dual CJS/ESM types with different default-export
// shapes: plain tsc resolves the ESM types (the MongoStore class), while
// Vercel's build-time checker resolves the CJS types (a namespace). At
// runtime the default export is always the class — normalize the type here
// so the code checks under both.
const MongoStore = MongoStoreImport as unknown as {
    create(options: {
        clientPromise: Promise<unknown>;
        collectionName: string;
    }): session.Store;
};

const app = express();
// Define if we are in production or not
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://app-track-frontend.vercel.app",
];

// Regex to catch Vercel preview deployments
// This matches https://app-track-frontend- followed by anything, ending in .vercel.app
const vercelPreviewRegex = /^https:\/\/app-track-frontend-.*\.vercel\.app$/;

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, origin);
            if (vercelPreviewRegex.test(origin)) return callback(null, origin);
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    }),
);

// Health check — registered before the DB middleware so it responds even
// when MongoDB is unreachable.
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running.",
        success: true,
    });
});

// Ensure the (cached) MongoDB connection is ready before handling any
// request below. Required on serverless (Vercel), where a cold start must
// not serve requests before the connection resolves — and where a fire-and-
// forget connect would crash the function on rejection.
app.use(async (_req, _res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

// Reuse the mongoose connection for session storage instead of letting
// connect-mongo open a second MongoDB connection per serverless instance.
// This promise must never reject: connect-mongo chains internal promises
// off it without rejection handlers, and an unhandled rejection kills the
// process (on Vercel: FUNCTION_INVOCATION_FAILED). Retry until connected —
// while the DB is down, the middleware above already fails requests with
// a 500 before the session store is ever reached.
const mongoClientPromise = (async () => {
    for (;;) {
        try {
            const m = await connectDB();
            return m.connection.getClient();
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
})();

app.use(
    session({
        name: "connect.sid",
        secret:
            process.env.SESSION_SECRET ||
            "1zMUz3AOgjhrF0Df335TyDI0dKE1RTo4MtaTnhyPxVQ=",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: isProduction, // must be true on Render (HTTPS)
            sameSite: isProduction ? "none" : "lax",
        },
        rolling: true,
        store: MongoStore.create({
            clientPromise: mongoClientPromise,
            collectionName: "sessions",
        }),
    }),
);

// API Routes
app.use("/api/v1", routeHandler);

// 404 Route
app.use((_req, _res, next) => {
    const error = new Error("Endpoint not found");
    (error as any).status = 404;
    next(error);
});

// Global Error Handler
app.use(
    (err: any, _req: Request, res: Response, _next: express.NextFunction) => {
        const statusCode = err.status || 500;

        res.status(statusCode).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    },
);

export default app;
