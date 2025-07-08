import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controllers.js";

const authRouter = Router();

// Route for user registration
authRouter.post("/sign-up", signUp);
// Route for user login
authRouter.post("/sign-in", signIn);
// Route for user logout
authRouter.post("/sign-out", signOut);


export default authRouter;