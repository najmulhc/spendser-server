import { Schema, models, model } from "mongoose";

interface UserType {
  username: string;
  hashedPassword: string;
  email: string;
  account: {
    balence: number, 
    deposit: number ,
    withdraw: number,
  }
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
      default: 0
    },
    deposit: {
      type: Number, 
      default: 0
    },
    withdraw: {
      type: Number, 
      default: 0
    },
  }
});

const User = models.user || model<UserType>("user", userSchema);

export default User;
