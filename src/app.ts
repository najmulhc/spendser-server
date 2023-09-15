import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv'
import userRouter from "./routes/userRouter";
import connect from "./utils/connection";
const app = express();
const port = process.env.PORT || 6969;
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

connect();

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Message from backend",
    token: "213c56743ea123f24",
  });
});

app.post("/user/login", (req: Request, res: Response) => {
   try {
    const {email, password} = req.body;
    if(password.includes(" ") || !password || password.length < 8 ) {
      throw new Error("Please enter a valid password")
    }
    if(email === "kridi32@outlook.com"){
      throw new Error("Your username is not allowed");
    }
    return res.json({
      success: true, 
      user: {email, password}
    })
   } catch (error:any) {
    return res.json({
      success: false, 
      message: error.message
    })
   }
});

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
