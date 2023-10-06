import { Schema, models, model } from "mongoose";
import { transactionSchema, transactionType } from "./transactionModel";
import { ResourceType, resourceSchema } from "./resourceModel";

interface UserType {
  username: string;
  hashedPassword: string;
  email: string;
 
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
