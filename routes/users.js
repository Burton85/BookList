const express = require("express");
const router = express.Router();
const userDB = require("../models/users");
const passport = require("passport");
const bcrypt = require("bcryptjs");
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/users/login"
  })(req, res, next);
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  //get parameter by body parser
  const { name, email, passport, phone, password, password2 } = req.body;
  //add err msg
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please fill the necessary field up!" });
  }
  if (password2 != password) {
    errors.push({
      message: "Please check the password is same with confirm one!"
    });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      email,
      name,
      password,
      password2,
      phone
    });
  } else {
    userDB.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ message: "Sorry,this email has been used!" });
        res.render("register", {
          errors,
          name,
          password,
          password2,
          email,
          phone
        });
      } else {
        const newUser = new userDB({ name, email, password, phone });
        //hash the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            //save the new user
            newUser
              .save()
              .then(user => {
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
//logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logout!");
  res.redirect("/users/login");
});

module.exports = router;
