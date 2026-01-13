import MongoStore from "connect-mongo";
import cors from "cors";
import express, { type Request, type Response } from "express";
import session from "express-session";
import morgan from "morgan";
import routeHandler from "./routes/index.js";

const app = express();
app.set("trust proxy", 1); // trust first proxy for Vercel
app.use(morgan("dev"));
app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin) return cb(null, true); // allow non-browser tools
            cb(null, allowedOrigins.includes(origin));
        },
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: process.env.NODE_ENV === "production",
        },
        rolling: true,
        store: MongoStore.create({
            mongoUrl:
                process.env.MONGODB_URI ||
                "mongodb://127.0.0.1:27017/app_track",
            collectionName: "sessions",
        }),
    })
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
    }
);

export default app;
