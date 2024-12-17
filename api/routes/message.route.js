import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { addMessage } from "../controllers/message.controller.js"

const messageRoute = express.Router()

messageRoute.post("/:chatId", verifyToken, addMessage)





export default messageRoute