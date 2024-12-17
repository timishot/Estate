import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js"

const postRoute = express.Router()


postRoute.get("/", getPosts)
postRoute.get("/:id", getPost)
postRoute.post("/", verifyToken, createPost)
postRoute.put("/:id", verifyToken, updatePost)
postRoute.delete("/:id", verifyToken, deletePost)

export default postRoute