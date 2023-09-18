import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModels";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";

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

    if(!user) {
      throw new Error(`we did not find ${username}`)
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
