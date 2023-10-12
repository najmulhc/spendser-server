"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var transactionModel_1 = require("./transactionModel");
var resourceModel_1 = require("./resourceModel");
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
    transactions: {
        type: [transactionModel_1.transactionSchema],
        default: [],
    },
    resources: {
        type: [resourceModel_1.resourceSchema],
        default: [],
    },
});
var User = mongoose_1.models.user || (0, mongoose_1.model)("user", userSchema);
exports.default = User;
