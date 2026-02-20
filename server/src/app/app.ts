import MongoStore from "connect-mongo";
import cors from "cors";
import express, { type Request, type Response } from "express";
import session from "express-session";
import morgan from "morgan";
import routeHandler from "./routes/index.js";

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

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // Postman/curl
            if (allowedOrigins.includes(origin)) return callback(null, origin);
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    }),
);

app.set("trust proxy", 1);

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
            mongoUrl:
                process.env.MONGODB_URI ||
                "mongodb://127.0.0.1:27017/app_track",
            collectionName: "sessions",
        }),
    }),
);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running.",
        success: true,
    });
});

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
