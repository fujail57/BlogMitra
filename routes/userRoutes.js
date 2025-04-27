const express = require("express");
const router = express.Router();

//local module
const userDb = require("../models/userModel");
const { genereteToken } = require("../services/authentication");

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await userDb.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/user/login");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

// post login routes:::::::

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // find user by username
    const User = await userDb.findOne({ email: email });
    if (!User || !(await User.comparePassword(password))) {
      return res
        .status(401)
        .render("login", { error: "Invalid username or password" });
    }
    // payload
    const payload = {
      id: User.id,
      fullName: User.fullName,
      email: User.fullName,
    };
    //generate token
    const token = genereteToken(payload);
    return res.status(200).cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("login", {
      error: "Incorrect Email or Password",
    });
  }
});

//  logout
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;

// :::::::::::::::::::

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // finsd user by username
//     const User = await userDb.findOne({ email: email });

//     // valid only if password is not hashed
//     // if (!User || !((await User.password) === password)) {
//     //   return res.status(401).json({ error: "Invalid username or password" });
//     // }

//     // for hashed password

//     if (!User || !(await User.comparePassword(password))) {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }
//     return res.status(200).json({ msg: "LogedIn successfully " });
//   } catch (error) {
//     console.log(error);
//   }
// });
