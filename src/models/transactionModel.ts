import { Request } from "express";
import mongoose, { model, models } from "mongoose";
import { resourceSchema, ResourceType } from "./resourceModel";

// typescript type declaretions for the transaction
export interface transactionType {
  amount: number;
  type: "deposit" | "withdraw";
  resource: ResourceType;
  time: number;
}

export const transactionSchema = new mongoose.Schema<transactionType>({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["deposit", "withdraw"], required: true },
  resource: {
    type: resourceSchema,
    required: [true, "what is the type of resource?"],
  },
  time: {
    type: Number,
    required: [true, "When you did the transaction?"],
  },
});

const Transaction =
  models.transaction ||
  model<transactionType>("transaction", transactionSchema);
export default Transaction;
