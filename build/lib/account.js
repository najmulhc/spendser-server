"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getAccount = function (transactions) {
    var account = {
        balence: 0,
        deposit: 0,
        withdraw: 0,
    };
    for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
        var transaction = transactions_1[_i];
        if (transaction.type === "deposit") {
            account.deposit += transaction.amount;
        }
        else {
            account.withdraw += transaction.amount;
        }
    }
    account.balence = account.deposit - account.withdraw;
    return account;
};
exports.default = getAccount;
