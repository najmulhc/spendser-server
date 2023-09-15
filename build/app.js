"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var userRouter_1 = __importDefault(require("./routes/userRouter"));
var connection_1 = __importDefault(require("./utils/connection"));
var app = (0, express_1.default)();
var port = process.env.PORT || 6969;
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", userRouter_1.default);
(0, connection_1.default)();
app.get("/", function (req, res) {
    return res.json({
        message: "Message from backend",
        token: "213c56743ea123f24",
    });
});
app.post("/user/login", function (req, res) {
    try {
        var _a = req.body, email = _a.email, password = _a.password;
        if (password.includes(" ") || !password || password.length < 8) {
            throw new Error("Please enter a valid password");
        }
        if (email === "kridi32@outlook.com") {
            throw new Error("Your username is not allowed");
        }
        return res.json({
            success: true,
            user: { email: email, password: password }
        });
    }
    catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
});
app.listen(port, function () {
    console.log("The app is running on port ".concat(port));
});
