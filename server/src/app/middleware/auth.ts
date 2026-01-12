import type { RequestHandler } from "express";

export const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.status(401).json({
            message: "Authentication required.",
            success: false,
        });
    }
};
