import { ValidationChain,check } from "express-validator";

export const userValidation: ValidationChain[] = [
    check('mobile')
        .trim()
        .notEmpty()
        .withMessage('mobile is required.')
        .bail()
        .isNumeric()
        .withMessage('mobile number must be numeric.')
        .bail()
        .isLength({ max: 10, min: 10 })
        .withMessage('mobile number must be 10 digits long.')
        .bail(),

    check('password')
        .trim()
        .notEmpty()
        .withMessage('password is required.')
        .bail()
        .isLength({ min: 8 })
        .withMessage('password is minimum 8 digits long.')
        .bail()
        .matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase is required')
        .matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase is required')
        .matches(/(?=.*?[0-9])/).withMessage('At least one Number is required')
        .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character is required')
        .not().matches(/^$|\s+/).withMessage('White space not allowed')
];

export const memberValidation: ValidationChain[] = [
    check('photoIdProof')
        .notEmpty()
        .withMessage('photoIdProof is required.')
        .bail(),

    check('photoIdNumber')
        .notEmpty()
        .withMessage('photoIdNumber is required.')
        .bail(),

    check('name')
        .notEmpty()
        .withMessage('name is required.')
        .bail(),

    check('gender')
        .notEmpty()
        .withMessage('gender is required.')
        .bail(),

    check('yearOfBirth')
        .trim()
        .notEmpty()
        .withMessage('yearOfBirth is required.')
        .bail()
        .isNumeric()
        .withMessage('yearOfBirth number must be numeric.')
        .bail()
        .isLength({ max: 4, min: 4 })
        .withMessage('yearOfBirth number must be 4 digits long.')
        .bail()
];

export const scheduleValidation: ValidationChain[] = [
    check('address')
        .notEmpty()
        .withMessage('address is required.')
        .bail(),

    check('vaccineType')
        .notEmpty()
        .withMessage('vaccineType is required.')
        .bail(),

    check('age')
        .notEmpty()
        .withMessage('age is required.')
        .bail(),

    check('cost')
        .notEmpty()
        .withMessage('cost is required.')
        .bail(),

    check('date')
        .notEmpty()
        .withMessage('date is required.')
        .bail(),

    check('timeSlot')
        .notEmpty()
        .withMessage('timeSlot is required.')
        .bail(),

    check('refId')
        .trim()
        .notEmpty()
        .withMessage('refId is required.')
        .bail()
        .isNumeric()
        .withMessage('refId number must be numeric.')
        .bail()
        .isLength({ max: 13, min: 13 })
        .withMessage('refId number must be 13 digits long.')
        .bail()
];

export const vaccinatedValidation: ValidationChain[] = [
    check('secretCode')
    .trim()
    .notEmpty()
    .withMessage('secretCode is required.')
    .bail()
    .isNumeric()
    .withMessage('secretCode number must be numeric.')
    .bail()
    .isLength({max: 4, min: 4})
    .withMessage('secretCode number must be 4 digits long.')
    .bail(),


    check('dose')
    .notEmpty()
    .withMessage('dose is required.')
    .bail()
];

export const addCenterValidation: ValidationChain[] = [
    check('centerName')
        .notEmpty()
        .withMessage('centerName is required.')
        .bail(),

    check('address')
        .notEmpty()
        .withMessage('address is required.')
        .bail(),

    check('name')
        .notEmpty()
        .withMessage('name is required.')
        .bail(),

    check('dose1')
        .notEmpty()
        .withMessage('dose1 is required.')
        .bail()
        .isNumeric()
        .withMessage('pinCode number must be numeric.')
        .bail(),

    check('dose2')
        .notEmpty()
        .withMessage('dose2 is required.')
        .bail()
        .isNumeric()
        .withMessage('pinCode number must be numeric.')
        .bail(),

    check('age')
        .notEmpty()
        .withMessage('age is required.')
        .bail(),

    check('cost')
        .notEmpty()
        .withMessage('cost is required.')
        .bail(),

    check('state')
        .notEmpty()
        .withMessage('state is required.')
        .bail(),

    check('city')
        .notEmpty()
        .withMessage('city is required.')
        .bail(),

    check('pinCode')
        .trim()
        .notEmpty()
        .withMessage('pinCode is required.')
        .bail()
        .isNumeric()
        .withMessage('pinCode number must be numeric.')
        .bail()
        .isLength({ max: 6, min: 6 })
        .withMessage('pinCode number must be 6 digits long.')
        .bail()
]

export const updateCenterValidation: ValidationChain[] = [
    check('centerId')
        .notEmpty()
        .withMessage('centerId is required.')
        .bail(),

    check('date')
        .notEmpty()
        .withMessage('date is required.')
        .bail(),

    check('name')
        .notEmpty()
        .withMessage('name is required.')
        .bail(),

    check('dose1')
        .notEmpty()
        .withMessage('dose1 is required.')
        .bail()
        .isNumeric()
        .withMessage('pinCode number must be numeric.')
        .bail(),

    check('dose2')
        .notEmpty()
        .withMessage('dose2 is required.')
        .bail()
        .isNumeric()
        .withMessage('pinCode number must be numeric.')
        .bail(),

    check('age')
        .notEmpty()
        .withMessage('age is required.')
        .bail()
]

export const fetchCenterByPincodeValidation: ValidationChain[] = [
    check('pinCode')
        .trim()
        .notEmpty()
        .withMessage('pinCode is required.')
        .bail()
        .isNumeric()
        .withMessage('pinCode number must be numeric.')
        .bail()
        .isLength({ max: 6, min: 6 })
        .withMessage('pinCode number must be 6 digits long.')
        .bail()
]

export const fetchCenterByCityAndStateValidation: ValidationChain[] = [
    check('state')
    .notEmpty()
    .withMessage('state is required.')
    .bail(),
    
    check('city')
    .notEmpty()
    .withMessage('city is required.')
    .bail()
]

export const countryNameValidation: ValidationChain[] = [
    check('countryName')
    .notEmpty()
    .withMessage('countryName is required.')
    .bail()
]

export const countryAndStateNameValidation: ValidationChain[] = [
    check('countryName')
    .notEmpty()
    .withMessage('countryName is required.')
    .bail(),

    check('stateName')
    .notEmpty()
    .withMessage('stateName is required.')
    .bail()
]