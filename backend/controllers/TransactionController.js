const Transaction = require('../models/Transaction');
const account = require('../models/Account')

const createTransaction = async (req, res) => {
    try {
        const { senderAccount, receiverAccount, amount, type, description, transactionDate} = req.body

        if(amount <= 0) {
            return res
              .status(400)
              .json({ error: "Amount must be greater than zero" });
        }

        const fromAcc = senderAccount ? await account.findOne({accountNumber : senderAccount}) : null;
        const toAcc = receiverAccount ? await account.findOne({accountNumber : receiverAccount}) : null;

        if (type === "transfer" && (!fromAcc || !toAcc))
          return res
            .status(404)
            .json({ error: "Both accounts must exist for transfer" });

            if (type === "withdrawal" && !fromAcc)
              return res
                .status(404)
                .json({ error: "From account must exist for withdrawal" });

            if (type === "deposit" && !toAcc)
              return res
                .status(404)
                .json({ error: "To account must exist for deposit" });

           
                if (fromAcc && fromAcc.status !== "active")
                  return res
                    .status(400)
                    .json({ error: "From account is not active" });

                if (toAcc && toAcc.status !== "active")
                  return res
                    .status(400)
                    .json({ error: "To account is not active" });

            
                    if (
                      (type === "withdrawal" ||
                        type === "transfer") &&
                      fromAcc.balance < amount
                    )
                      return res
                        .status(400)
                        .json({ error: "Insufficient funds" });

                    // Process balances
                    if (
                      fromAcc &&
                      (type === "withdrawal" ||
                        type === "transfer")
                    ) {
                      fromAcc.balance -= amount;
                      await fromAcc.save();
                    }
                    if (
                      toAcc &&
                      (type === "deposit" ||
                       type === "transfer")
                    ) {
                      toAcc.balance += amount;
                      await toAcc.save();
                    }

                    const transaction = new Transaction({
                      fromAccount: fromAcc ? fromAcc._id : null,
                      toAccount: toAcc ? toAcc._id : null,
                      amount,
                      type,
                      description,
                      transactionDate: transactionDate || Date.now()
                    });

                    await transaction.save();

                    res.status(201).json(transaction);


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });

    }
}

const getTransactions = async (req,res) => {
    try {
        const accountId = req.params.accountId

        const transaction = await Transaction.find({
            $or : [{senderAccount: accountId}, {receiverAccount: accountId}],
        }).sort({timestamps: -1})

        res.json(transaction)
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    createTransaction,
    getTransactions
}