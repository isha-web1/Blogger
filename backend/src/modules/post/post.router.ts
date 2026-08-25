import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { postController } from "./post.controller";



const router = express.Router();


router.get("/", postController.getAllPost)


router.get(
    "/my-posts",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.getMyPosts
)


router.get(
    "/:postId",
    postController.getPostById
)

router.post(
    "/",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.createPost
)




export const postRouter = router;