import { Router } from "express";
import cronJobApiController from "../controller/cronJobApiController";
const router: Router = Router();

// @route   POST vaccinated
// @desc    Give JWT token & required fields, done vaccine.
// @access  Private
router.post("/delete", cronJobApiController.cronJob);

export default router;