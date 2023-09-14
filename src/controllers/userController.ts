import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModels";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";

export const postUser = async (req: Request, res: Response) => {
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
    // const savedUser = await createdUser.save();
    const userToken = jwt.sign(
      {
        username: createdUser.username,
        email: createdUser.email,
      },
      "7f9e2d8c6a5b1f3e0d9c8b7a6e5d4f2"
    );

    const decoded = jwt.verify(userToken, "7f9e2d8c6a5b1f3e0d9c8b7a6e5d4f2");
    return res.json({
      success: true,
      token: userToken,
      user: createdUser,
      decoded,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
