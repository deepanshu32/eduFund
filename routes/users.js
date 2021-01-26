const express = require('express');
const router = express.Router();
const Users = require("../models/users");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    const user = new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile
    });
    console.log(user);
    const saveUser = await user.save();
    const token = await saveUser.generateAuthToken();
    res.status(200).send({
      success: true,
      message: "Registeration successfull!",
      user: saveUser.getPublicProfile(),
      token: token
    });
  }catch(err){
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).json({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        console.log("Error")
        res.status(409).json({ success: false, error: "Email or mobile number already registered!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
});

router.post("/login", async (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    const findUser = await Users.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await findUser.generateAuthToken();
    res.status(200).json({
      success: true,
      user: findUser.getPublicProfile(),
      token: token,
    });
  }catch(err){
    console.log(err);
    res.status(401).send({
      error: err.message
    });
  }
});

router.get("/profile", auth.loginAuth, async (req, res) => {
  try{
    let user = req.user;
    if(user){
      res.status(200).send({
        success: true,
        user: user
      });
    }else{
      res.status(440).json({ success: false, error: "Session Expired!" });
    }
  }catch(err){
    console.log(err);
    res.status(440).json({ success: false, error: "Session Expired!" });
  }
});

module.exports = router;
