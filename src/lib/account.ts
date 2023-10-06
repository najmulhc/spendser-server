const getAccount = (transactions:any) => {
    const account = {
      balence: 0,
      deposit: 0,
      withdraw: 0,
    };

     for (let transaction of transactions) {
       if (transaction.type === "deposit") {
         account.deposit += transaction.amount;
       } else {
         account.withdraw += transaction.amount;
       }
     }
     account.balence = account.deposit - account.withdraw;

    return account;
}

export default getAccount;