import { Schema, model, models } from "mongoose";
import { transactionSchema } from "./transactionModel";

export interface transactionResourceType {
    name: string, 
    type: 'deposit' | 'withdraw'
}

export const TransactionResourceSchema = new Schema<transactionResourceType>({
    name: {
        type: String, 
        required: [true, 'You need to spacify the type of transaction resource.']
    }, 
    type: {
    enum: ["deposit", "withdraw"]
    }
})

const TransactionResource =
  models.transactionResource ||
  model("transactionResource", TransactionResourceSchema);

export default TransactionResource;