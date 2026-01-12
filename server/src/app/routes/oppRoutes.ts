import { Router } from "express";
import {
    createOpp,
    deleteOpp,
    getAllOpps,
    updateOpp,
} from "../controllers/oppController.js";
const router = Router();

router.post("/", createOpp);

router.get("/", getAllOpps);

router.put("/:id", updateOpp);

router.delete("/:id", deleteOpp);

export default router;
