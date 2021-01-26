const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const Users = require("../models/users");
const config = require("../config");
const validator = require("./validator");
const {
  validationResult
} = require("express-validator");

/* This auth function for login authentication. */
module.exports.loginAuth = [validator.jwtTokenValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({
            success: false,
            errors: errors.array()
            });
        }
        const token = req.header("Authorization").replace("JWT ", "");
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET, {
        algorithms: ["HS256"]
        });
        const user = await Users.findOne({
        _id: decoded._id
        });
        if (!user) {
        throw new Error();
        }
        req.token = token;
        req.user = user.getPublicProfile();
        next();
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      error: "Access Denied!"
    });
  }
}];