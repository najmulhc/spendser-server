import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModels";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import Resource, { ResourceType } from "../models/resourceModel";
import getAccount from "../lib/account";
import { transactionType } from "../models/transactionModel";

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

    const account = getAccount(savedUser.transactions);

    return res.json({
      success: true,
      user: {
        username,
        account,
        resources: savedUser.resources,
      },
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

    if (!user) {
      throw new Error("User does not exists!");
    }
    const correctPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!correctPassword) {
      throw new Error("Password is incorrect!");
    }

    const account = getAccount(user.transactions);

    const userToken: string = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_PRIVATE_KEY || "shh...."
    );

    res.json({
      success: true,
      user: {
        username: user.username,
        account,
        resources: user.resources,
      },
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

    const { transactions } = user;
    const account = getAccount(transactions);

    return res.json({
      success: true,
      user: {
        username,
        resources: user.resources,
        account,
      },
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// <- RESOURCE PART ->

// add a new resource,
export const postResource = async (req: Request, res: Response) => {
  try {
    // varify the user
    const { username, type, name } = req.body;

    const user = await User.findOne({
      username,
    });

    if (!name || name === " ") {
      throw new Error("Resource name required!");
    }
    const foundResource = user.resources.filter(
      (item: any) => item.name === name
    );
    if (foundResource[0]) {
      throw new Error("The resource already exists!");
    }

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
    if (type !== ("deposit" || "withdraw")) {
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
export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { username, name, type } = req.body;

    const user = await User.findOne({
      username,
    });

    user.resources = user.resources.filter((item: any) => item.name !== name);

    user.transactions = user.transactions.filter(
      (item: any) => item.resource.name !== name
    );

    const savedUser = await user.save();
    const account = getAccount(savedUser.transactions);

    return res.json({
      success: true,
      user: {
        account,
        resources: savedUser.resources.filter(
          (resource: ResourceType) => resource.type === type
        ),
      },
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get the resource data

export const getFilteredResources = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({
      username,
    });
    const { resources, transactions } = user;
    const data = [];

    for (let resource of resources) {
      const resourceTransctions = transactions.filter(
        (transaction: transactionType) =>
          transaction.resource.name === resource.name
      );
      const resourceData = {
        name: resource.name,
        type: resource.type,
        total: 0,
      };
      for (let item of resourceTransctions) {
        resourceData.total += item.amount;
      }
      data.push(resourceData);
    }

    return res.json({
      success: true,
      resources: data,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const resourcesThisMonth = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const user: any = await User.findOne({
      username,
    });

    const { transactions, resources } = user;
    const date = new Date();
    const firstOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      .getTime();

    const filteredTransactions = transactions.filter(
      (itme: any) => itme.time > firstOfThisMonth
    );
    const monthAccount = getAccount(filteredTransactions);

    const data = [];

    for (let resource of resources) {
      const resourceTransctions = filteredTransactions.filter(
        (transaction: transactionType) =>
          transaction.resource.name === resource.name
      );
      const resourceData = {
        name: resource.name,
        type: resource.type,
        total: 0,
      };
      for (let item of resourceTransctions) {
        resourceData.total += item.amount;
      }
      data.push(resourceData);
    }

    return res.json({
      success: true,
      account: monthAccount,
      resources: data,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
