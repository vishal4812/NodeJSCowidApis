import { Router } from "express";
import userApiController from "../controller/userApiController";
import authenticate from "../middleware/authenticate";
const router: Router = Router();

// @route   POST user
// @desc    Give Mobile number, returns the token upon successful registration or login.
// @access  Public
router.post("/",userApiController.loginRegister);
router.get("/",authenticate, userApiController.userData);
router.post("/addMember",authenticate, userApiController.addMember);

export default router;