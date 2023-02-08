import { Router } from "express";
import userApiController from "../controller/userApiController";
import validateToken from "../middleware/validateToken";
import { validateRequest } from "../validation/validateRequest";
import { userValidation } from "../validation/validations";
const router: Router = Router();

// @route   POST user
// @desc    Give Mobile number and Password, returns the token upon successful registration or login.
// @access  Public
router.post("/user", validateRequest(userValidation), userApiController.loginRegister);

// @route   GET user
// @desc    Give JWT token, returns the user data.
// @access  Private
router.get("/user", validateToken, userApiController.fetchUserData);

export default router;