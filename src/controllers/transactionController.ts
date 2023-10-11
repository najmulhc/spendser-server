import { Request, Response } from "express";
import User from "../models/userModels";
import Transaction from "../models/transactionModel";
import varifyJWT from "../middlewares/varifyJWT";
import getAccount from "../lib/account";

export const postTransaction = async (req: Request, res: Response) => {
  try {
    const { username, amount, type, resource } = req.body;
    const user = await User.findOne({
      username: username,
    });
    if (!amount || !type || !resource) {
      throw new Error("Invalid transaction input");
    }
    const userResource = user.resources.filter(
      (item: any) => item.name === resource
    );
    if (!userResource[0]) {
      throw new Error(`Resource " ${resource} " does not exist to the user!`);
    }

    if (userResource[0].type !== type) {
      return new Error(`${userResource.name} is not a ${type} type.`);
    }
    const transaction = new Transaction({
      type,
      resource: userResource[0],
      amount: parseInt(amount),
    });
    user.transactions.push(transaction);

    const savedUser = await User.findOneAndUpdate({ username }, user);
    const resultUser = await User.findOne({ username });
    return res.json({
      success: true,
      account: getAccount(resultUser.transactions),
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// for getting all the transactions of the user

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({
      username,
    });
    if (!user.username) {
      throw new Error("user does not exists");
    }

    return res.json({
      success: true,
      transactions: user.transactions,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
