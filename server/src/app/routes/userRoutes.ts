import { Router } from "express";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    signUp,
    updateUser,
} from "../controllers/userController.js";
const router = Router();

router.post("/", signUp);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
