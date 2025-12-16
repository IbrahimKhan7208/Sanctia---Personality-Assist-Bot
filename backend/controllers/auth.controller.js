import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
  let { name, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
  return res.json({ error: "E-mail already exists" });
}


  bcrypt.hash(password, 10, async function (err, hash) {
    const user = await userModel.create({
      name,
      email,
      password: hash,
    });

    let token = jwt.sign({ email: req.body.email, id: user._id }, process.env.SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({ success: true, user });
  });
};

export const userLogin = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) return res.json({ error: "No user found" });

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: req.body.email, id: user._id }, process.env.SECRET);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      res.json({ success: true, user });
    } else {
      return res.json({ error: "Wrong Password" });
    }
  });
};

export const userLogout = async (req, res) => {
  res.clearCookie("token");
  res.json({ error: "Logged out successfully" });
};