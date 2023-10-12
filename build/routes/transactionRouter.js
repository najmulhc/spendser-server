"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
var transactionController_1 = require("../controllers/transactionController");
var transactionRouter = express_1.default.Router();
transactionRouter.post("/", varifyJWT_1.default, transactionController_1.postTransaction);
transactionRouter.get("/", varifyJWT_1.default, transactionController_1.getAllTransactions);
exports.default = transactionRouter;
