"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var resourceModel_1 = require("./resourceModel");
exports.transactionSchema = new mongoose_1.default.Schema({
    amount: { type: Number, required: true },
    type: { type: String, enum: ["deposit", "withdraw"], required: true },
    resource: {
        type: resourceModel_1.resourceSchema,
        required: [true, "what is the type of resource?"],
    },
    time: {
        type: Number,
        required: [true, "When you did the transaction?"],
    },
    description: {
        type: String, required: [
            true, "We need the description for the transaction."
        ]
    }
});
var Transaction = mongoose_1.models.transaction ||
    (0, mongoose_1.model)("transaction", exports.transactionSchema);
exports.default = Transaction;
