import { Request } from "express";
import mongoose, { model, models } from "mongoose";
import {
  TransactionResourceSchema,
  transactionResourceType,
} from "./transactionResourceModel";

export interface transactionType {
  amount: number;
  type: "add" | "spend";
  resourceType: transactionResourceType;
}

export const transactionSchema = new mongoose.Schema<transactionType>({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["add", "spend"], required: true },
  resourceType: {
    type: TransactionResourceSchema,
    required: [true, "what is the type of resource?"],
  },
});

const Transaction =
  models.transaction ||
  model<transactionType>("transaction", transactionSchema);
export default Transaction;
