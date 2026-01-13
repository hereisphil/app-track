import type { NextFunction, Request, Response } from "express";
import type {} from "../../../@types/session.js";
import OppModel from "../models/Opportunity.js";
import User from "../models/User.js";
import { assertDefined } from "../util/assertDefined.js";

/* -------------------------------------------------------------------------- */
/*                              POST: New Opp                              */
/* -------------------------------------------------------------------------- */
export const createOpp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertDefined(authenticatedUserId);
        // check for empty body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data received.",
                success: false,
            });
        }
        const data = req.body;

        // First, find the User by the User's ID given:
        const user = await User.findById(authenticatedUserId).exec();

        if (!user) {
            return res.status(400).json({
                message:
                    "A user by the id cannot be found. Please send your request again.",
                success: false,
            });
        }
        // Next, update the data with the User's information:
        data.user = user;
        // Then, create a new Opportunity model
        const oppData = new OppModel(data);
        // Push the user id to the user.opps array
        user.opportunities.push(oppData._id);
        // save the opp and user data
        const queries = [oppData.save(), user.save()];
        await Promise.all(queries);

        return res.status(201).json({
            message: "Opportunity created successfully",
            success: true,
            opportunity: oppData,
        });
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
    const authenticatedUserId = req.session.userId;
    try {
        assertDefined(authenticatedUserId);
        const opps = await OppModel.find({ userId: authenticatedUserId })
            .sort({ createdAt: -1 })
            .exec();
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
    const authenticatedUserId = req.session.userId;
    try {
        assertDefined(authenticatedUserId);

        // Check for request body BEFORE fetch
        const data = req.body;
        if (!data || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message:
                    "No data received. Please provide data to update the Opportunity.",
                success: false,
            });
        }

        const foundOpp = await OppModel.findById(id).exec();

        if (!foundOpp) {
            return res.status(404).json({
                message: `No Opp found with id: ${id}`,
                success: false,
            });
        }

        if (foundOpp.userId.equals(authenticatedUserId) === false) {
            return res.status(403).json({
                message: "You do not have permission to update this Opp.",
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
    const authenticatedUserId = req.session.userId;
    try {
        assertDefined(authenticatedUserId);

        const foundOpp = await OppModel.findById(id);
        if (!foundOpp) {
            return res.status(404).json({
                message: `No Opp found with id: ${id}`,
                success: false,
            });
        }

        if (foundOpp.userId.equals(authenticatedUserId) === false) {
            return res.status(403).json({
                message: "You do not have permission to update this Opp.",
                success: false,
            });
        }

        await OppModel.deleteOne({ _id: id }).exec();
        return res.status(200).json({
            message: "Opportunity deleted successfully",
            success: true,
        });
    } catch (err) {
        // Unexpected errors: let global error middleware handle it
        next(err);
    }
};
