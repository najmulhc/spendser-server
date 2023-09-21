import { Schema, models, model } from "mongoose";
import { transactionSchema, transactionType } from "./transactionModel";
import { ResourceType, resourceSchema } from "./resourceModel";

interface UserType {
  username: string;
  hashedPassword: string;
  email: string;
  account: {
    balence: number;
    deposit: number;
    withdraw: number;
  };
  transactions: transactionType[];
  resources: ResourceType[];
}

const userSchema = new Schema<UserType>({
  username: {
    type: String,
    required: [true, "We need an username."],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  hashedPassword: {
    type: String,
    required: [true, "Please enter password"],
  },
  account: {
    balence: {
      type: Number,
      default: 0,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    withdraw: {
      type: Number,
      default: 0,
    },
  },
  transactions: {
    type: [transactionSchema],
    default: [],
  },
  resources: {
    type: [resourceSchema],
    default: [],
  },
});

const User = models.user || model<UserType>("user", userSchema);

export default User;
