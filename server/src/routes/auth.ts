import { Router } from "express";
import { checkRefreshToken } from "@middlewares/token";
import * as authValidator from "@validators/auth";
import * as authController from "@controllers/auth";

const router = Router();

router.post("/register", authValidator.register, authController.register);
router.post("/login", authValidator.login, authController.login);
router.get("/logout", authController.logout);
router.get(
  "/refresh-token",
  checkRefreshToken,
  authController.newAccessTokenFromRefreshToken
);

export default router;
