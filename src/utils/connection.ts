import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:w0xeEAgEwKHx6ZLf@usercluster.ipjz1vx.mongodb.net/?retryWrites=true&w=majority"
    );
    if (mongoose.connection) {
      console.log("MongoDB connected!");
    }
  } catch (error: any) {
    console.log("Mongodb connection error:", error.message);
  }
};

export default connect;
