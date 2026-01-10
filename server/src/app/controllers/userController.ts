import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

/* -------------------------------------------------------------------------- */
/*                      SIGN UP (POST): Create a new user                     */
/* -------------------------------------------------------------------------- */

interface SignUpBody {
    email: string;
    password: string;
}

interface PublicUser {
    id: string;
    email: string;
}

type ApiResponse =
    | { success: true; message: string; user: PublicUser }
    | { success: false; message: string };

export const signUp: RequestHandler<
    unknown,
    ApiResponse,
    Partial<SignUpBody>
> = async (req, res, next) => {
    try {
        // check for empty body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data received. Required: email and password.",
                success: false,
            });
        }
        const emailRaw = req.body.email;
        const passwordRaw = req.body.password;

        // Basic presence checks (defensive against missing body / wrong shape)
        if (typeof emailRaw !== "string" || emailRaw.trim().length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Email is required." });
        }
        if (typeof passwordRaw !== "string" || passwordRaw.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required." });
        }

        const email = emailRaw.trim().toLowerCase();
        const password = passwordRaw;

        // Basic format checks (not perfect, but good enough for API-level validation)
        const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailLooksValid) {
            return res
                .status(400)
                .json({ success: false, message: "Email is not valid." });
        }

        // Minimal password policy
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters.",
            });
        }

        // Duplicate check
        const existingUser = await User.findOne({ email }).lean().exec();
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists.",
            });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHashed = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await User.create({ email, password: passwordHashed });
        req.session.userId = (
            newUser._id as mongoose.Types.ObjectId
        ).toString();

        // Build a safe response object
        const publicUser: PublicUser = {
            id: (newUser._id as mongoose.Types.ObjectId).toString(),
            email: newUser.email,
        };

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            user: publicUser,
        });
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                              LOGIN (POST) User                             */
/* -------------------------------------------------------------------------- */
interface LoginBody {
    email: string;
    password: string;
}

export const login: RequestHandler<
    unknown,
    ApiResponse,
    Partial<LoginBody>
> = async (req, res, next) => {
    try {
        // check for empty body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data received. Required: email and password.",
                success: false,
            });
        }
        const emailRaw = req.body.email;
        const passwordRaw = req.body.password;

        if (typeof emailRaw !== "string" || emailRaw.trim().length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Email is required." });
        }
        if (typeof passwordRaw !== "string" || passwordRaw.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required." });
        }

        const email = emailRaw.trim().toLowerCase();
        const password = passwordRaw;

        const user = await User.findOne({ email }).select("+password").exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        req.session.userId = (user._id as mongoose.Types.ObjectId).toString();

        // Build a safe response object
        const publicUser: PublicUser = {
            id: (user._id as mongoose.Types.ObjectId).toString(),
            email: user.email,
        };

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: publicUser,
        });
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                       GET Authenticated User Details                       */
/* -------------------------------------------------------------------------- */
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated.",
                success: false,
            });
        }

        const user = await User.findById(userId).select("+email").exec();
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Authenticated user retrieved successfully.",
            success: true,
            user: {
                id: (user._id as mongoose.Types.ObjectId).toString(),
                email: user.email,
            },
        });
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                             Logout (POST) User                             */
/* -------------------------------------------------------------------------- */
export const logout: RequestHandler = (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie("connect.sid");
            return res.sendStatus(204);
        });
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};
