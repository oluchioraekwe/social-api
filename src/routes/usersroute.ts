import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/usersmodels";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("welcome");
});

router.get("/users", (req: Request, res: Response) => {
  res.status(200).send("Welcome to users page");
});
//update user
router.put("/:id", async (req: Request, res: Response) => {
  if (req.body._id === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).send("Account has been updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).send("You can update only your account");
  }
});

//delete user
router.delete("/:id", async (req: Request, res: Response) => {
  if (req.body._id === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).send("Account has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).send("You can delete only your account");
  }
});
//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).send(other);
  } catch (error) {
    res.status(500).send(error);
  }
});
//follow a user
router.put("/follow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json("user has been followed");
      }
      res.status(403).json("you allready follow this user");
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});
//unfollow a user
router.put("/unfollow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).json("user has been unfollowed");
      }
      res.status(403).json("you are not following this user");
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

export = router;
