import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
  let { name, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.json({ error: "Este e-mail já está cadastrado." });
  }

  bcrypt.hash(password, 10, async function (err, hash) {
    const user = await userModel.create({
      name,
      email,
      password: hash,
    });

    let token = jwt.sign(
      { email: req.body.email, id: user._id },
      process.env.SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ success: true, user });
  });
};

export const userLogin = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) return res.json({ error: "Não encontramos uma conta com esses dados." });

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign(
        { email: req.body.email, id: user._id },
        process.env.SECRET
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      res.json({ success: true, user });
    } else {
      return res.json({ error: "A senha informada está incorreta." });
    }
  });
};

export const userLogout = async (req, res) => {
  res.clearCookie("token");
  res.json({ error: "Logged out successfully" });
};
