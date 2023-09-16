"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
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
var User = mongoose_1.models.user || (0, mongoose_1.model)("user", userSchema);
exports.default = User;
