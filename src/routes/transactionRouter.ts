import express from "express";
import varifyJWT from "../middlewares/varifyJWT";
import { postTransaction } from "../controllers/transactionController";

const transactionRouter = express.Router();

transactionRouter.post("/", varifyJWT, postTransaction);

export default transactionRouter;