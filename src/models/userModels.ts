import { Schema, models, model } from "mongoose";

interface UserType {
  username: string;
  hashedPassword: string;
  email: string;
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
});

const User = models.user || model<UserType>("user", userSchema);

export default User;
