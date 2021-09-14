import express from "express";
import mongoose, { Schema, model, connect } from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import routerpath from "./routes/usersroute";
import authpath from "./routes/auth";
import postRoute from "./routes/postroutes";

const app = express();
dotenv.config();

async function run(): Promise<void> {
  //  Connect to MongoDB
  await connect("mongodb://localhost:27017/intant-message-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  console.log("Connected to mongodb"); // 'bill@initech.com'
}
run();
//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/users", routerpath);
app.use("/api/auth", authpath);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend server is running");
});
