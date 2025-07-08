import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/user.models.js"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRATION } from "../config/env.js"

export const signUp = async (req, res, next) => {
    console.log("Request body:", req.body); // Debug log

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error("Name, email, and password are required.");
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if(existingUser){
            const error = new Error("User already exists");
            error.statusCode = 400;
            throw error;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        const token = jwt.sign(
            { userId: newUsers[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                token,
                user: {
                    id: newUsers[0]._id,
                    name: newUsers[0].name,
                    email: newUsers[0].email
                },
            }
        });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}

export const signIn = async (req, res, next) => {
    console.log("Request body:", req.body); // Debug log
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and password are required.");
            error.statusCode = 400;
            throw error;
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if(!user){
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        });
    }catch(error){
        next(error);
    }
}

export const signOut = async (req, res, next) => {}