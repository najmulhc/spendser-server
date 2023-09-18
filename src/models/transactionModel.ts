import { Request } from "express";
import mongoose, { model, models } from "mongoose";

export interface transactionType {
  amount: number;
  type: "add" | "spend";
}

export const transactionSchema = new mongoose.Schema<transactionType>({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["add", "spend"], required: true },
});

const Transaction =
  models.transaction ||
  model<transactionType>("transaction", transactionSchema);
export default Transaction;
