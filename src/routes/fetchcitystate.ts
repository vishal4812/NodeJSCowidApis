import { Router } from "express";
import fetchCityStateApiController from "../controller/fetchCityStateApiController";
import { validateRequest } from "../validation/validateRequest";
import { countryNameValidation,countryAndStateNameValidation } from "../validation/validations";
const router: Router = Router();

// @route   GET states
// @desc    Give JWT token, returns the user data.
// @access  Public
router.get("/states", validateRequest(countryNameValidation), fetchCityStateApiController.fetchStateByCountry);

// @route   GET cities
// @desc    Give JWT token, returns the user data.
// @access  Public
router.get("/cities", validateRequest(countryAndStateNameValidation), fetchCityStateApiController.fetchCityByStateAndCountry);

export default router;