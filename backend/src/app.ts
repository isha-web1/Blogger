import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router";

const app : Application = express();


app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000", // client side url
    credentials: true
}))

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use('/posts', postRouter)
app.use("/comments", commentRouter);


app.get("/", (req, res) => {
    res.send("Hello, World!");
});


export default app;