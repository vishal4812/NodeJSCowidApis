import { Router } from "express";
import addmemberApiController from "../controller/addmemberApiController";
import validateToken from "../middleware/validateToken";
import { validateRequest } from "../validation/validateRequest";
import { memberValidation } from "../validation/validations";
const router: Router = Router();

// @route   POST addmember
// @desc    Give JWT token & required fields, add member in members array.
// @access  Private
router.post("/addmember", validateToken, validateRequest(memberValidation), addmemberApiController.addMember);

// @route   POST deletemember
// @desc    Give JWT token & refId in query params, delete member.
// @access  Private
router.delete("/deletemember", validateToken, addmemberApiController.deleteMember);

export default router;