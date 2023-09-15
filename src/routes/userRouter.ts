import express from "express";
import { createNewUser, getUser, login } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/sign-up", createNewUser);
userRouter.post("/login", login);
userRouter.get("/", getUser)

export default userRouter;
