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
exports.getLastTransactions = exports.getAllTransactions = exports.postTransaction = void 0;
var userModels_1 = __importDefault(require("../models/userModels"));
var transactionModel_1 = __importDefault(require("../models/transactionModel"));
var account_1 = __importDefault(require("../lib/account"));
var postTransaction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, amount, type_1, resource_1, description, user, userResource, time, transaction, savedUser, resultUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, amount = _a.amount, type_1 = _a.type, resource_1 = _a.resource, description = _a.description;
                return [4 /*yield*/, userModels_1.default.findOne({
                        username: username,
                    })];
            case 1:
                user = _b.sent();
                if (!amount || !type_1 || !resource_1 || !description) {
                    throw new Error("Invalid transaction input");
                }
                if (!user.resources.filter(function (item) { return item.type === type_1; })) {
                    throw new Error("No Resource found. Please add a resource before adding transactions.");
                }
                userResource = user.resources.filter(function (item) { return item.name === resource_1; });
                if (!userResource[0]) {
                    throw new Error("Resource \" ".concat(resource_1, " \" does not exist to the user!"));
                }
                if (userResource[0].type !== type_1) {
                    return [2 /*return*/, new Error("".concat(userResource.name, " is not a ").concat(type_1, " type."))];
                }
                time = new Date().getTime();
                transaction = new transactionModel_1.default({
                    type: type_1,
                    resource: userResource[0],
                    amount: parseInt(amount),
                    time: time,
                    description: description
                });
                user.transactions.push(transaction);
                return [4 /*yield*/, userModels_1.default.findOneAndUpdate({ username: username }, user)];
            case 2:
                savedUser = _b.sent();
                return [4 /*yield*/, userModels_1.default.findOne({ username: username })];
            case 3:
                resultUser = _b.sent();
                return [2 /*return*/, res.json({
                        success: true,
                        account: (0, account_1.default)(resultUser.transactions),
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
exports.postTransaction = postTransaction;
// for getting all the transactions of the user
var getAllTransactions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, account, error_2;
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
                if (!user.username) {
                    throw new Error("user does not exists");
                }
                account = (0, account_1.default)(user.transactions);
                return [2 /*return*/, res.json({
                        success: true,
                        transactions: user.transactions,
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_2.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllTransactions = getAllTransactions;
// get transaction info of last 1 day, 1 week, 1 month
var getLastTransactions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, timeSpan, currentTime, lastTime_1, user, filteredTransactions, account, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                username = req.body.username;
                timeSpan = req.params.timeSpan;
                currentTime = new Date().getTime();
                lastTime_1 = currentTime;
                switch (timeSpan) {
                    case "day":
                        lastTime_1 -= 86400000;
                        break;
                    case "week":
                        lastTime_1 -= 604800000;
                        break;
                    case "month":
                        lastTime_1 -= 30.44 * 24 * 60 * 60 * 1000;
                        break;
                    case "thisMonth":
                        lastTime_1 = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
                        break;
                    default:
                        lastTime_1 = currentTime;
                        break;
                }
                return [4 /*yield*/, userModels_1.default.findOne({
                        username: username,
                    })];
            case 1:
                user = _a.sent();
                filteredTransactions = user.transactdions.filter(function (transaction) { return transaction.time > lastTime_1; });
                account = (0, account_1.default)(filteredTransactions);
                return [2 /*return*/, res.json({
                        success: true,
                        transactions: filteredTransactions,
                        account: account,
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
exports.getLastTransactions = getLastTransactions;
