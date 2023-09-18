import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const varifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers ;
  //@ts-ignore
  jwt.verify(
    token as string,
    process.env.JWT_PRIVATE_KEY as string,
    function (err: any, decoded: any) {
      if (decoded) {
        const { username } = decoded;
        req.body.username = username;
      } else {
        throw new Error("Invalid request!");
      }
    }
  );

  next();
};

export default varifyJWT;
