import bcrypt from "bcrypt";
import type { Request, RequestHandler, Response } from "express";
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
/*                              GET: All Users                              */
/* -------------------------------------------------------------------------- */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        if (!users || Object.keys(users).length === 0) {
            return res.status(400).json({
                message:
                    "No exisiting users. Send a POST request to create one.",
                success: false,
            });
        }
        return res.status(200).json({
            message: `${req.method} - Request made`,
            success: true,
            users,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

/* -------------------------------------------------------------------------- */
/*                              GET: User By Id                             */
/* -------------------------------------------------------------------------- */
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id!)) {
            return res.status(400).json({
                message: `Invalid MongoDB ObjectId: ${id}`,
                success: false,
            });
        }
        const user = await User.findById(id);
        if (!user || Object.keys(user).length === 0) {
            return res.status(404).json({
                message: `No user found with id: ${id}`,
                success: false,
            });
        }
        return res.status(200).json({
            message: `${req.method} - Request made`,
            success: true,
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

/* -------------------------------------------------------------------------- */
/*                            PUT: Update a User                           */
/* -------------------------------------------------------------------------- */
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id!)) {
            return res.status(400).json({
                message: `Invalid MongoDB ObjectId: ${id}`,
                success: false,
            });
        }

        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data received. Required: email.",
                success: false,
            });
        }

        const foundUser = await User.findById(id);
        if (!foundUser || Object.keys(foundUser).length === 0) {
            return res.status(404).json({
                message: `No user found with id: ${id}`,
                success: false,
            });
        }
        const updatedUser = await User.findByIdAndUpdate(id, data, {
            new: true,
        });
        return res.status(200).json({
            message: `${req.method} - Request made`,
            success: true,
            user: updatedUser,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

/* -------------------------------------------------------------------------- */
/*                          DELETE: Remove a User                          */
/* -------------------------------------------------------------------------- */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id!)) {
            return res.status(400).json({
                message: `Invalid MongoDB ObjectId: ${id}`,
                success: false,
            });
        }
        const user = await User.findById(id);
        if (!user || Object.keys(user).length === 0) {
            return res.status(404).json({
                message: `No user found with id: ${id}`,
                success: false,
            });
        }
        await User.deleteOne({ _id: id }).exec();
        return res.status(200).json({
            message: `User has been deleted`,
            success: true,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};
