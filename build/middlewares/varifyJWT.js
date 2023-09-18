"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var varifyJWT = function (req, res, next) {
    var token = req.headers.token;
    //@ts-ignore
    jsonwebtoken_1.default.verify(token, process.env.JWT_PRIVATE_KEY, function (err, decoded) {
        if (decoded) {
            var username = decoded.username;
            req.body.username = username;
        }
        else {
            throw new Error("Invalid request!");
        }
    });
    next();
};
exports.default = varifyJWT;
