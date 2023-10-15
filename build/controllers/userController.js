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
exports.resourcesThisMonth = exports.getFilteredResources = exports.deleteResource = exports.getResources = exports.postResource = exports.getUser = exports.login = exports.createNewUser = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var userModels_1 = __importDefault(require("../models/userModels"));
var mongoose_1 = require("mongoose");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var resourceModel_1 = __importDefault(require("../models/resourceModel"));
var account_1 = __importDefault(require("../lib/account"));
// creating new user
var createNewUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, salt, hashedPassword, createdUser, savedUser, userToken, account, error_1;
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
                account = (0, account_1.default)(savedUser.transactions);
                return [2 /*return*/, res.json({
                        success: true,
                        user: {
                            username: username,
                            account: account,
                            resources: savedUser.resources,
                        },
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
    var _a, credential, password, emailUser, usernameUser, user, correctPassword, account, userToken, error_2;
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
                if (!user) {
                    throw new mongoose_1.Error("User does not exists!");
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.hashedPassword)];
            case 3:
                correctPassword = _b.sent();
                if (!correctPassword) {
                    throw new mongoose_1.Error("Password is incorrect!");
                }
                account = (0, account_1.default)(user.transactions);
                userToken = jsonwebtoken_1.default.sign({
                    username: user.username,
                    email: user.email,
                }, process.env.JWT_PRIVATE_KEY || "shh....");
                res.json({
                    success: true,
                    user: {
                        username: user.username,
                        account: account,
                        resources: user.resources,
                    },
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
    var username, user, transactions, account, error_3;
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
                transactions = user.transactions;
                account = (0, account_1.default)(transactions);
                return [2 /*return*/, res.json({
                        success: true,
                        user: {
                            username: username,
                            resources: user.resources,
                            account: account,
                        },
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
// <- RESOURCE PART ->
// add a new resource,
var postResource = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, type_1, name_1, user, foundResource, newResource, savedUser, resultUser, error_4;
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
                if (!name_1 || name_1 === " ") {
                    throw new mongoose_1.Error("Resource name required!");
                }
                foundResource = user.resources.filter(function (item) { return item.name === name_1; });
                if (foundResource[0]) {
                    throw new mongoose_1.Error("The resource already exists!");
                }
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
                if (type_2 !== ("deposit" || "withdraw")) {
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
var deleteResource = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, name_2, type_3, user, savedUser, account, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, name_2 = _a.name, type_3 = _a.type;
                return [4 /*yield*/, userModels_1.default.findOne({
                        username: username,
                    })];
            case 1:
                user = _b.sent();
                user.resources = user.resources.filter(function (item) { return item.name !== name_2; });
                user.transactions = user.transactions.filter(function (item) { return item.resource.name !== name_2; });
                return [4 /*yield*/, user.save()];
            case 2:
                savedUser = _b.sent();
                account = (0, account_1.default)(savedUser.transactions);
                return [2 /*return*/, res.json({
                        success: true,
                        user: {
                            account: account,
                            resources: savedUser.resources.filter(function (resource) { return resource.type === type_3; }),
                        },
                    })];
            case 3:
                error_6 = _b.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_6.message,
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteResource = deleteResource;
// get the resource data
var getFilteredResources = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, resources, transactions, data, _loop_1, _i, resources_1, resource, error_7;
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
                resources = user.resources, transactions = user.transactions;
                data = [];
                _loop_1 = function (resource) {
                    var resourceTransctions = transactions.filter(function (transaction) {
                        return transaction.resource.name === resource.name;
                    });
                    var resourceData = {
                        name: resource.name,
                        type: resource.type,
                        total: 0,
                    };
                    for (var _b = 0, resourceTransctions_1 = resourceTransctions; _b < resourceTransctions_1.length; _b++) {
                        var item = resourceTransctions_1[_b];
                        resourceData.total += item.amount;
                    }
                    data.push(resourceData);
                };
                for (_i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
                    resource = resources_1[_i];
                    _loop_1(resource);
                }
                return [2 /*return*/, res.json({
                        success: true,
                        resources: data,
                    })];
            case 2:
                error_7 = _a.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_7.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFilteredResources = getFilteredResources;
var resourcesThisMonth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, transactions, resources, date, firstOfThisMonth_1, filteredTransactions, monthAccount, data, _loop_2, _i, resources_2, resource;
    return __generator(this, function (_a) {
        try {
            username = req.body.username;
            user = userModels_1.default.findOne({
                username: username,
            });
            transactions = user.transactions, resources = user.resources;
            date = new Date();
            firstOfThisMonth_1 = new Date(date.getFullYear(), date.getMonth(), 1)
                .getTime;
            filteredTransactions = transactions.filter(function (itme) { return itme.time > firstOfThisMonth_1; });
            monthAccount = (0, account_1.default)(filteredTransactions);
            data = [];
            _loop_2 = function (resource) {
                var resourceTransctions = filteredTransactions.filter(function (transaction) {
                    return transaction.resource.name === resource.name;
                });
                var resourceData = {
                    name: resource.name,
                    type: resource.type,
                    total: 0,
                };
                for (var _b = 0, resourceTransctions_2 = resourceTransctions; _b < resourceTransctions_2.length; _b++) {
                    var item = resourceTransctions_2[_b];
                    resourceData.total += item.amount;
                }
                data.push(resourceData);
            };
            for (_i = 0, resources_2 = resources; _i < resources_2.length; _i++) {
                resource = resources_2[_i];
                _loop_2(resource);
            }
            return [2 /*return*/, res.json({
                    success: true,
                    account: monthAccount,
                    resources: data,
                })];
        }
        catch (error) {
            return [2 /*return*/, res.json({
                    success: false,
                    message: error.message,
                })];
        }
        return [2 /*return*/];
    });
}); };
exports.resourcesThisMonth = resourcesThisMonth;
