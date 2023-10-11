import express from "express";
import varifyJWT from "../middlewares/varifyJWT";
import {
  getAllTransactions,
  postTransaction,
} from "../controllers/transactionController";

const transactionRouter = express.Router();

transactionRouter.post("/", varifyJWT, postTransaction);
transactionRouter.get("/", varifyJWT, getAllTransactions);

export default transactionRouter;
