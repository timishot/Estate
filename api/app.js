import express from "express"
import cors from "cors"
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser"
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

const corsOptions = {
    origin: "http://localhost:5173", // Allow this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // If using cookies or authentication
  };


const app = express();

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


app.use("/api/posts", postRoute)
app.use("/api/auth", authRoute)
app.use("/api/test", testRoute)
app.use("/api/users", userRoute)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)



app.listen(8800, () => {
    console.log("server is running");
})