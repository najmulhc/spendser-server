"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.getResources = exports.postResource = exports.getUser = exports.login = exports.createNewUser = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var userModels_1 = __importDefault(require("../models/userModels"));
var mongoose_1 = require("mongoose");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var resourceModel_1 = __importDefault(require("../models/resourceModel"));
// creating new user
var createNewUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, salt, hashedPassword, createdUser, savedUser, userToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                return [4 /*yield*/, bcrypt_1.default.genSalt(12)];
            case 1:
                salt = _b.sent();
                if (!password) {
                    throw new mongoose_1.Error("Password is required!");
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 2:
                hashedPassword = _b.sent();
                createdUser = new userModels_1.default({
                    username: username,
                    email: email,
                    hashedPassword: hashedPassword,
                });
                return [4 /*yield*/, createdUser.save()];
            case 3:
                savedUser = _b.sent();
                userToken = jsonwebtoken_1.default.sign({
                    username: savedUser.username,
                    email: savedUser.email,
                }, process.env.JWT_PRIVATE_KEY || "shh....");
                return [2 /*return*/, res.json({
                        success: true,
                        token: userToken,
                    })];
            case 4:
                error_1 = _b.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_1.message,
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createNewUser = createNewUser;
// for handling login requests
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, credential, password, emailUser, usernameUser, user, correctPassword, userToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, credential = _a.credential, password = _a.password;
                return [4 /*yield*/, userModels_1.default.findOne({
                        email: credential,
                    })];
            case 1:
                emailUser = _b.sent();
                return [4 /*yield*/, userModels_1.default.findOne({
                        username: credential,
                    })];
            case 2:
                usernameUser = _b.sent();
                user = emailUser || usernameUser;
                console.log(user);
                if (!user) {
                    throw new mongoose_1.Error("User does not exists!");
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.hashedPassword)];
            case 3:
                correctPassword = _b.sent();
                if (!correctPassword) {
                    throw new mongoose_1.Error("Password is incorrect!");
                }
                userToken = jsonwebtoken_1.default.sign({
                    username: user.username,
                    email: user.email,
                }, process.env.JWT_PRIVATE_KEY || "shh....");
                res.json({
                    success: true,
                    user: user,
                    token: userToken,
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_2.message,
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
// when you have jwt, you want to get the user account.
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                username = req.body.username;
                return [4 /*yield*/, userModels_1.default.findOne({
                        username: username,
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new mongoose_1.Error("we did not find ".concat(username));
                }
                return [2 /*return*/, res.json({
                        success: true,
                        user: user,
                    })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_3.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
// add a new resource,
var postResource = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, type_1, name_1, user, newResource, savedUser, resultUser, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, type_1 = _a.type, name_1 = _a.name;
                return [4 /*yield*/, userModels_1.default.findOne({
                        username: username,
                    })];
            case 1:
                user = _b.sent();
                newResource = new resourceModel_1.default({
                    name: name_1,
                    type: type_1,
                });
                //update the user with the new resource
                user.resources.push(newResource);
                return [4 /*yield*/, userModels_1.default.findOneAndUpdate({ username: username }, user)];
            case 2:
                savedUser = _b.sent();
                return [4 /*yield*/, userModels_1.default.findOne({ username: username })];
            case 3:
                resultUser = _b.sent();
                // return the resources with  the same type
                return [2 /*return*/, res.json({
                        success: true,
                        resources: resultUser.resources.filter(function (r) { return r.type === type_1; }),
                    })];
            case 4:
                error_4 = _b.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_4.message,
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.postResource = postResource;
// get resource
var getResources = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, type_2, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                username = req.body.username;
                return [4 /*yield*/, userModels_1.default.findOne({
                        username: username,
                    })];
            case 1:
                user = _a.sent();
                type_2 = req.query.type;
                //@ts-ignore
                if (type_2 !== "deposit" || type_2 !== "withdraw") {
                    throw new mongoose_1.Error("Invalid type of resource!");
                }
                if (!user) {
                    throw new mongoose_1.Error("user does not exist");
                }
                return [2 /*return*/, res.json({
                        success: true,
                        resources: user.resources.filter(function (resource) { return resource.type === type_2; }),
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_5.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getResources = getResources;
// delete a resource
var deleteResource = function (req, res) {
    try {
        // varify the user
        // find the resource  (send the error if there is no resource)
        // delete the resource
        // delete transactions with the resources
        // return the same resources without the deleted reriu
    }
    catch (error) {
        return res.json({
            success: false,
            message: "the api is not ready",
        });
    }
};
exports.deleteResource = deleteResource;
