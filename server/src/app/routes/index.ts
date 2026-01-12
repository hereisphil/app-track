import type { Request, Response } from "express";
import express from "express";
import oppRoutes from "./oppRoutes.js";
import userRoutes from "./userRoutes.js";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "API is running",
        request: `${req.method} - Request made`,
        success: true,
    });
});

router.use("/users", userRoutes);
router.use("/opps", oppRoutes);

export default router;
