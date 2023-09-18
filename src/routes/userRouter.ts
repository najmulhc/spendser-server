import express from "express";
import { createNewUser, getUser, login } from "../controllers/userController";
import varifyJWT from "../middlewares/varifyJWT";

const userRouter = express.Router();

userRouter.post("/sign-up", createNewUser);
userRouter.post("/login", login);
userRouter.get("/",varifyJWT ,getUser)

export default userRouter;
