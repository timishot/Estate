import express from "express"

import { verifyToken } from "../middleware/verifyToken.js"
import { addChats, getChat, getChats, readChat } from "../controllers/chat.controller.js"

const chatRoute = express.Router()

chatRoute.get("/", verifyToken, getChats)
chatRoute.get("/:id", verifyToken, getChat)
chatRoute.post("/", verifyToken, addChats)
chatRoute.post("/read/:id", verifyToken, readChat)
// chatRoute.delete("/:id", verifyToken, deleteUser)
// chatRoute.post("/save", verifyToken, savePost)
// chatRoute.get("/profilePosts", verifyToken, profilePosts)




export default chatRoute