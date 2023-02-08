import { Router } from "express";
import vaccinatedApiController from "../controller/vaccinatedApiController";
import validateTokenAndAdmin from "../middleware/validateTokenAndAdmin";
import { validateRequest } from "../validation/validateRequest";
import { vaccinatedValidation } from "../validation/validations";
const router: Router = Router();

// @route   POST vaccinated
// @desc    Give JWT token & required fields, done vaccine.
// @access  Private
router.post("/vaccinated", validateRequest(vaccinatedValidation), vaccinatedApiController.vaccinated);

export default router;