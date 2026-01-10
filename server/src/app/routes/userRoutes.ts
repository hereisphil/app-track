import { Router } from "express";
import {
    deleteUser,
    getAuthenticatedUser,
    // getAllUsers,
    getUserById,
    login,
    signUp,
    updateUser,
} from "../controllers/userController.js";
const router = Router();

router.post("/signup", signUp);

router.post("/login", login);

// router.get("/", getAllUsers);

router.get("/", getAuthenticatedUser);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
