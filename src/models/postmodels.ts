import mongoose, { Schema, model, connect } from "mongoose";

interface Post {
  userId: string;
  description: string;
  img: string;
  likes: string[];
}
const PostSchema = new Schema<Post>(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export = mongoose.model("Post", PostSchema);
