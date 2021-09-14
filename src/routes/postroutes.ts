import { Router } from "express";
import Post from "../models/postmodels";
import User from "../models/usersmodels";
const router = Router();

router.get("/", (req, res) => {
  console.log("post page");
});
//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (error) {
    res.status(500).send(error);
  }
});
//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send("The post has been updated");
    } else {
      res.status(403).send("You can only update your post");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).send("The post has been deleted");
    } else {
      res.status(403).send("You can only delete your post");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
//like or dislike post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send("The post has been disliked");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});
//get timeline post
router.get("/timeline/all", async (req, res) => {
  //let postArray = [];
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPost = await Post.find({ userId: currentUser._id });
    const frienddPost = await Promise.all(
      currentUser.followings.map((friendId: any) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).send(userPost.concat(...frienddPost));
  } catch (error) {
    res.status(500).send(error);
  }
});
export = router;
