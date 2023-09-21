import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModels";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import Resource, { ResourceType } from "../models/resourceModel";

// creating new user
export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(12);
    if (!password) {
      throw new Error("Password is required!");
    }
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new User({
      username,
      email,
      hashedPassword,
    });
    const savedUser = await createdUser.save();
    const userToken: string = jwt.sign(
      {
        username: savedUser.username,
        email: savedUser.email,
      },
      process.env.JWT_PRIVATE_KEY || "shh...."
    );

    return res.json({
      success: true,
      token: userToken,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// for handling login requests
export const login = async (req: Request, res: Response) => {
  try {
    const { credential, password } = req.body;
    const emailUser = await User.findOne({
      email: credential,
    });
    const usernameUser = await User.findOne({
      username: credential,
    });
    const user = emailUser || usernameUser;
    console.log(user);
    if (!user) {
      throw new Error("User does not exists!");
    }
    const correctPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!correctPassword) {
      throw new Error("Password is incorrect!");
    }
    const userToken: string = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_PRIVATE_KEY || "shh...."
    );

    res.json({
      success: true,
      user,
      token: userToken,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// when you have jwt, you want to get the user account.
export const getUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      throw new Error(`we did not find ${username}`);
    }

    return res.json({
      success: true,
      user: user,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// add a new resource,
export const postResource = async (req: Request, res: Response) => {
  try {
    // varify the user
    const { username, type, name } = req.body;
    if (type !== "deposit" || type !== "withdraw") {
      throw new Error("Invalid type of resource!");
    }

    const user = await User.findOne({
      username: username,
    });

    // create new resource
    const newResource = new Resource({
      name,
      type: type,
    });
    //update the user with the new resource
    user.resources.push(newResource);

    const savedUser = await User.findOneAndUpdate({ username }, user);
    const resultUser = await User.findOne({ username });

    // return the resources with  the same type
    return res.json({
      success: true,
      resources: resultUser.resources.filter(
        (r: ResourceType) => r.type === type
      ),
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get resource
export const getResources = async (req: Request, res: Response) => {
  try {
    // varify the user
    const { username } = req.body;
    const user = await User.findOne({
      username: username,
    });
    const type = req.query.type;
    //@ts-ignore
    if (type !== "deposit" || type !== "withdraw") {
      throw new Error("Invalid type of resource!");
    }

    if (!user) {
      throw new Error("user does not exist");
    }
    return res.json({
      success: true,
      resources: user.resources.filter(
        (resource: ResourceType) => resource.type === type
      ),
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// delete a resource
export const deleteResource = (req: Request, res: Response) => {
  try {
    // varify the user
    // find the resource  (send the error if there is no resource)
    // delete the resource
    // delete transactions with the resources
    // return the same resources without the deleted reriu
  } catch (error) {
    return res.json({
      success: false,
      message: "the api is not ready",
    });
  }
};
