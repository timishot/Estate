import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query.city)
    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                propertyType: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 1000000
                }
            }
        });
        console.log(posts)
        res.status(200).json({posts})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get posts"})
    }
}

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch post from database
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          // If token verification fails, return the post without saved status
          return res.status(200).json({ ...post, isSaved: false });
        }

        // Check if the post is saved by the user
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        // Respond with the post and saved status
        return res.status(200).json({ ...post, isSaved: saved ? true : false });
      });
    } else {
      // If there's no token, respond without saved status
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to get post" });
  }
};


export const createPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create:body.postDetail,
                }
            }
        })

        console.log(newPost)
        
        res.status(200).json({newPost})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to create posts"})
    }
}

export const updatePost = async (req, res) => {
    try {
        res.status(200).json({})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to update posts"})
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (post.userId !== tokenUserId) {
            return res.status(403).json({message: "Not Authorized"})
        }
        await prisma.post.delete({
            where: { id }
        });
        res.status(200).json({message: "Post deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete posts"})
    }
}