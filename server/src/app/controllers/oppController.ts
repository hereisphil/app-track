import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import OppModel from "../models/Opportunity.js";
/* -------------------------------------------------------------------------- */
/*                              POST: New Opp                              */
/* -------------------------------------------------------------------------- */
export const createOpp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // check for empty body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data received. Required: email and password.",
                success: false,
            });
        } else {
            const data = req.body;
            const newOpp = await OppModel.create(data);
            return res.status(201).json({
                message: "Opportunity created successfully",
                success: true,
                opportunity: newOpp,
            });
        }
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                              GET: All Opps                              */
/* -------------------------------------------------------------------------- */
export const getAllOpps = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const opps = await OppModel.find().sort({ createdAt: -1 }).exec();
        return res.status(200).json({
            message: "Request successful",
            success: true,
            Opportunities: opps,
        });
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                            PUT: Update an Opp                           */
/* -------------------------------------------------------------------------- */
export const updateOpp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    try {
        // Validate the ObjectId format BEFORE querying
        if (!mongoose.Types.ObjectId.isValid(id!)) {
            return res.status(400).json({
                message: `Invalid MongoDB ObjectId: ${id}`,
                success: false,
            });
        }

        // Check for request body BEFORE fetch
        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message:
                    "No data received. Please provide data to update the Opportunity.",
                success: false,
            });
        }

        const foundOpp = await OppModel.findById(id);
        if (!foundOpp) {
            return res.status(404).json({
                message: `No Opp found with id: ${id}`,
                success: false,
            });
        }
        const opp = await OppModel.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).json({
            message: "Opportunity updated successfully",
            success: true,
            opp,
        });
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};

/* -------------------------------------------------------------------------- */
/*                          DELETE: Remove an Opp                          */
/* -------------------------------------------------------------------------- */
export const deleteOpp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    try {
        // Validate the ObjectId format BEFORE querying
        if (!mongoose.Types.ObjectId.isValid(id!)) {
            return res.status(400).json({
                message: `Invalid MongoDB ObjectId: ${id}`,
                success: false,
            });
        }
        const foundOpp = await OppModel.findById(id);
        if (!foundOpp) {
            return res.status(404).json({
                message: `No Opp found with id: ${id}`,
                success: false,
            });
        } else {
            await OppModel.deleteOne({ _id: id }).exec();
            return res.status(200).json({
                message: "Opportunity deleted successfully",
                success: true,
            });
        }
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};
