import { Router } from "express";
import {
    getAuthenticatedUser,
    login,
    logout,
    signUp,
} from "../controllers/userController.js";
const router = Router();

router.post("/signup", signUp);

router.post("/login", login);

router.get("/", getAuthenticatedUser);

router.post("/logout", logout);

export default router;
