import { Request, Response } from "express";
import User from "../models/userModels";
import Transaction from "../models/transactionModel";

export const postTransaction = async (req: Request, res: Response) => {
  try {
    const { username, amount, type } = req.body;
    const user = await User.findOne({
      username: username,
    });
    const transaction = new Transaction({ type, amount: parseInt(amount) });
    user.transactions.push(transaction);
    if (type === "add") {
      user.account.deposit += parseInt(amount);
      user.account.balence += parseInt(amount);
    } else if (type === "spend") {
      user.account.balence -= parseInt(amount);
      user.account.withdraw += parseInt(amount);
    } else {
      throw new Error("Transaction type is not valid!")
    }
    const savedUser = await User.findOneAndUpdate({ username }, user);
    const resultUser = await User.findOne({ username });
    return res.json({
      success: true,
      account: resultUser.account,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// add a new resource, 

// get resource 

// delete a resource 