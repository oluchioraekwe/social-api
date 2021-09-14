import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/usersmodels";
const router = Router();

//REGISTER
router.get("/auth", (req: Request, res: Response) => {
  res.send("welcome to authentication path");
});
router.post("/register", async (req: Request, res: Response) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //const user = req.body;
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //save user and return response
    const user = await newUser.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("wrong password");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

export = router;
