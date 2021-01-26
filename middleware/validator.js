const {
    check,
    header,
    validationResult
} = require('express-validator');

/* JWT token related validations */
module.exports.jwtTokenValidator = [
    header("Authorization").isJWT().withMessage("Token is invalid!")
]