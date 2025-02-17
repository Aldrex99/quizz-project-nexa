import { Router } from "express";
import * as userController from "../controllers/user";

const router = Router();

router.get("/me", userController.getMe);

export default router;
