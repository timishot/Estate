import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
    
    try {  
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get users"})
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id
    try {  
        const user = await prisma.user.findUnique({
            where: { id },
        });
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get user"})
    }
}

export const updateUser= async (req, res) => {
    const id = req.params.id
    
    const tokenUserId = req.userId;
    console.log(tokenUserId)
    console.log(req.body)
    const { password, avatar, ...inputs } = req.body;
    console.log(inputs)
    const updatedAvater = avatar
    console.log(updatedAvater)
    

    if (id !== tokenUserId ) {
         return res.status(403).json({message: "Not Authorized"})
    }
    let updatedPassword = null
    try {
         if(password){
            updatedPassword = await bcrypt.hash(password, 10)
         }

        const updateUser = await prisma.user.update({
            where: {id},
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(updatedAvater && { avatar: updatedAvater})
            },
        })

        const { password:userPassword, ...rest } = updateUser
        res.status(200).json(rest)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get users"})
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id
    const tokenUserId = req.userId;

    if (id !== tokenUserId ) {
         return res.status(403).json({message: "Not Authorized"})
    }
    try {  
        await prisma.user.delete({
            where:{id}
        })
        res.status(200).json({ message: "User Deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get users"})
    }
}

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;
  
    try {
      const savedPost = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: tokenUserId,
            postId,
          },
        },
      });

      console.log(savedPost);
  
      if (savedPost) {
        await prisma.savedPost.delete({
          where: {
            id: savedPost.id,
          },
        });
        console.log("delete")
        res.status(200).json({ message: "Post removed from saved list" });
      } else {
        await prisma.savedPost.create({
          data: {
            userId: tokenUserId,
            postId,
          },
        });
        console.log("made to work")
        res.status(200).json({ message: "Post saved" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to delete users!" });
    }
  };
  

export const profilePosts = async (req, res) => {
  const tokenUserId = req.params.userId
  console.log(tokenUserId)
  try {  
      const userPosts = await prisma.post.findMany({
          where: { userId:  tokenUserId },
      });
      const saved = await prisma.savedPost.findMany({
        where: { userId:  tokenUserId },
        include:{
          post: true
        }
    });
    const savePosts = saved.map(item=>item.post)
    console.log(savePosts)
    console.log(userPosts)
      res.status(200).json({userPosts, savePosts})
  } catch (error) {
      console.log(error)
      res.status(500).json({message: "Failed to get profile post"})
  }
}

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId

  console.log(tokenUserId)
  try {  
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId]
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId]
          }
        }
      }})
      console.log(number)
      res.status(200).json(number)
  } catch (error) {
      console.log(error)
      res.status(500).json({message: "Failed to get profile post"})
  }
}