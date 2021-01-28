const {
    check,
    header,
    validationResult
} = require('express-validator');

/* JWT token related validations */
module.exports.jwtTokenValidator = [
    header("Authorization").isJWT().withMessage("Token is invalid!")
]

/* User Registration validation */
module.exports.registerValidator = [
    check("firstName").isAlpha().isLength({ min: 2, max: 50 }).withMessage("First Name is invalid!"),
    check("lastName").isAlpha().isLength({ min: 1, max: 50 }).withMessage("Last Name is invalid!"),
    check("email").isEmail().withMessage("Email is invalid!").isLength({ min: 5, max: 50 }).withMessage("Email is invalid!"),
    check("password").isLength({ min: 6 }).withMessage("Password should be of minimum 6 characters!"),
    check("mobile").isMobilePhone().withMessage("Mobile number is invalid!")
]

/* User Log in validation */
module.exports.loginInValidator = [
    check("email").isEmail().withMessage("Email is invalid!"),
    check("password").isLength({ min: 6 }).withMessage("Password should be of minimum 6 characters!")
]