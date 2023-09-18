"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("../controllers/userController");
var varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
var userRouter = express_1.default.Router();
userRouter.post("/sign-up", userController_1.createNewUser);
userRouter.post("/login", userController_1.login);
userRouter.get("/", varifyJWT_1.default, userController_1.getUser);
exports.default = userRouter;
