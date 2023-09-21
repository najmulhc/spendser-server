"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceSchema = void 0;
var mongoose_1 = require("mongoose");
exports.resourceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "You need to spacify the type of transaction resource."],
    },
    type: {
        type: String,
        enum: ["deposit", "withdraw"],
        required: true,
    },
});
var Resource = mongoose_1.models.resource || (0, mongoose_1.model)("resource", exports.resourceSchema);
exports.default = Resource;
