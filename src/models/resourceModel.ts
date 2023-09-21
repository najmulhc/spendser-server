import { Schema, model, models } from "mongoose";
export interface ResourceType {
  name: string;
  type: "deposit" | "withdraw";
}

export const resourceSchema = new Schema<ResourceType>({
  name: {
    type: String,
    required: [true, "You need to spacify the type of transaction resource."],
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true,
  },
});

const Resource = models.resource || model("resource", resourceSchema);

export default Resource;
