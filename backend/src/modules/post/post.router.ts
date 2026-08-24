import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { postController } from "./post.controller";



const router = express.Router();


router.get("/", postController.getAllPost)

router.post(
    "/",
    auth(UserRole.USER),
    postController.createPost
)


router.post(
    "/",
    auth(UserRole.USER),
    postController.createPost
)




export const postRouter = router;