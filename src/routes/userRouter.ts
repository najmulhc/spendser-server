import express from "express";
import {
  createNewUser,
  deleteResource,
  getFilteredResources,
  getResources,
  getUser,
  login,
  postResource,
} from "../controllers/userController";
import varifyJWT from "../middlewares/varifyJWT";

const userRouter = express.Router();

userRouter.post("/sign-up", createNewUser);
userRouter.post("/login", login);
userRouter.get("/", varifyJWT, getUser);
userRouter.post("/resources", varifyJWT, postResource);
userRouter.get("/resources", varifyJWT, getResources);
userRouter.delete("/resources", varifyJWT, deleteResource);
userRouter.get("/filtered", varifyJWT, getFilteredResources);

export default userRouter;
