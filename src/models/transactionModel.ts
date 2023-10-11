import { Request } from "express";
import mongoose, { model, models } from "mongoose";
import { resourceSchema, ResourceType } from "./resourceModel";

export interface transactionType {
  amount: number;
  type: "add" | "spend";
  resource: ResourceType;
}

export const transactionSchema = new mongoose.Schema<transactionType>({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["add", "spend"], required: true },
  resource: {
    type: resourceSchema,
    required: [true, "what is the type of resource?"],
  },
});

const Transaction =
  models.transaction ||
  model<transactionType>("transaction", transactionSchema);
export default Transaction;
