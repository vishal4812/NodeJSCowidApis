import { Router } from "express";
import validateTokenAndAdmin from "../middleware/validateTokenAndAdmin";
import { validateRequest } from "../validation/validateRequest";
import { addCenterValidation,updateCenterValidation,fetchCenterByPincodeValidation,fetchCenterByCityAndStateValidation } from "../validation/validations";
import vaccineCenterApiController from "../controller/vaccineCenterApiController";
const router: Router = Router();

// @route   POST addvaccinecenter
// @desc    Give required fields, add vaccine center.
// @access  Public
router.post("/addvaccinecenter", validateTokenAndAdmin, validateRequest(addCenterValidation), vaccineCenterApiController.addvaccinecenter);

// @route   POST updatevaccinecenter
// @desc    Give required fields, update vaccine center.
// @access  Public
router.post("/updatevaccinecenter", validateTokenAndAdmin, validateRequest(updateCenterValidation), vaccineCenterApiController.updatevaccinecenter);

// @route   POST center/pincode
// @desc    Give pinCode and filteration fields, fetch vaccine center.
// @access  Public
router.post("/center/pincode", validateRequest(fetchCenterByPincodeValidation), vaccineCenterApiController.getcenterbypincode);

// @route   POST center/city&state
// @desc    Give city and state and filteration fields, fetch vaccine center.
// @access  Public
router.post("/center/city&state", validateRequest(fetchCenterByCityAndStateValidation), vaccineCenterApiController.getcenterbycitystate);

export default router;