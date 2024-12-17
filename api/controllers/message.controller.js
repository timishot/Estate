import prisma from "../lib/prisma.js"

export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;
    console.log(req.body)
    console.log(tokenUserId, chatId, text)
    try {

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        })

        if (!chat) return res.status(404).json({message: "Chat not found!"});
        const message = await prisma.message.create({
            data: {
                text,
                chatId,
                userId: tokenUserId
            }
        });
        await prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                seenBy: [tokenUserId],
                lastMessagee: text
            }
        })
        console.log(message)
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get message"})
    }
}

