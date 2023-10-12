import { transactionType } from "./../models/transactionModel";
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

    if (!user.resources.filter((item: any) => item.type === type)) {
      throw new Error(
        "No Resource found. Please add a resource before adding transactions."
      );
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
    const time = new Date().getTime();
    const transaction = new Transaction({
      type,
      resource: userResource[0],
      amount: parseInt(amount),
      time,
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

    const account = getAccount(user.transactions)

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

// get transaction info of last 1 day, 1 week, 1 month

export const getLastTransactions = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const { timeSpan } = req.params;
    // the client will provide the timespan {day, week, month}
    const currentTime = new Date().getTime();
    let lastTime = currentTime;

    switch (timeSpan) {
      case "day":
        lastTime -= 86400000;
        break;
      case "week":
        lastTime -= 604800000;
        break;
      case "month":
        lastTime -= 30.44 * 24 * 60 * 60 * 1000;
        break;
      case "thisMonth":
        lastTime = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).getTime();
        break;

      default:
        lastTime = currentTime;
        break;
    }

    const user = await User.findOne({
      username,
    });


    const filteredTransactions = user.transactdions.filter(
      (transaction: transactionType) => transaction.time > lastTime
    );

    const account = getAccount(filteredTransactions);

    return res.json({
      success: true,
      transactions: filteredTransactions,
      account,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
