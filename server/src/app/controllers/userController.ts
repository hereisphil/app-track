import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

/* -------------------------------------------------------------------------- */
/*                              POST: New User                              */
/* -------------------------------------------------------------------------- */
export const createUser = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data received. Required: email.",
                success: false,
            });
        }
        const email = data.email;
        const user = {
            email,
        };
        const newUser = await User.create(user);
        return res.status(201).json({
            message: `${req.method} - Request made`,
            success: true,
            user: newUser,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
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
