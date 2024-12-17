import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
    const { username, email, password } = req.body

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)

        // crate a new user and save to db 
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            },
        })
        console.log(newUser)
        res.status(201).json({ message: "User created successfully" })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to create user!" })
    }
   
}

export const login = async (req, res) => {
    const {username, password} = req.body;
 

    try {

        // CHECK  IF THE USER EXISTS

        const user = await prisma.user.findUnique({
            where: {username}
        })

        if (!user) return res.status(401).json({ message: "Invalid Credentials!" })
        // CHECK IF THE PASSWORD IS CORRECT

        const isPasswordValid = await bcrypt.compare(password, user.password)
        console.log(isPasswordValid)

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials!" })

        // GENERATE COOKIE TOKEN AND SEND TO THE CLIENT

        // res.setHeader("Set-Cookie", "test=" + "myValue" ).json("success")
        const age = 1000 * 60 * 60 * 24 * 7
        const token = jwt.sign({
            id: user.id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY, { expiresIn: age})

        const {password: userPassword,  ...userInf0} = user
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: age, // 7 days
        }).status(200).json(userInf0)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to login!"})
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful"})
} 