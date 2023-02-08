import { Router } from "express";
import scheduleApiController from "../controller/scheduleApiController";
import validateToken from "../middleware/validateToken";
import { validateRequest } from "../validation/validateRequest";
import { scheduleValidation } from "../validation/validations";
const router: Router = Router();

// @route   POST schedule
// @desc    Give JWT token & required fields, schedule vaccine dose as per request.
// @access  Private
router.post("/schedule", validateToken, validateRequest(scheduleValidation), scheduleApiController.schedule);

export default router;