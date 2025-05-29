const account = require('../models/Account');
const User = require('../models/User');



const createAccount = async (req, res) => {
   

    try {
        const {
          accountType,
          balance,
          currency,
          status
        } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }


        if(user && user.status !== 'active') {
            return res.status(400).json({ error: "This user is not active" });
        }
        

        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const newAccount = new account({
            userId,
            accountNumber,
            accountType: accountType || 'checking',
            balance: balance || 0,
            currency: currency || 'USD',
            status: status || 'active',
           
        });

        
       

        const savedAccount = await newAccount.save();
        res.status(201).json({
            message: 'Account created successfully',
            account: savedAccount
        });

    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Server error' });
    }


}

const getMyUserAccount = async (req, res) => {
    try {
        const userId = req.user.id; // Use req.user._id if no userId is provided in params
        const accountfind = await account.findOne({ userId }).populate('userId', 'name email');
        if (!accountfind) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(accountfind);
    } catch (error) {
        console.error('Error fetching user account:', error);
        res.status(500).json({ message: 'Server error' });
}

}

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await account.find().populate('userId', 'name email');
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching all accounts:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateAccount = async (req, res) => {
    try {
        const accountid = req.params.accountId;
        const { accountType, balance, status, currency } = req.body;
        const userId = req.user.id;

        const updatedAccount = await account.findById(accountid);
       

        if (!updatedAccount) {
            return res.status(404).json({ message: 'Account not found ' });
        }

        if (updatedAccount.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to update this account' });
        }



        updatedAccount.accountType = accountType || updatedAccount.accountType;
        updatedAccount.balance = balance !== undefined ? balance : updatedAccount.balance;
        updatedAccount.status = status || updatedAccount.status;
        updatedAccount.currency = currency || updatedAccount.currency;
        await updatedAccount.save();

       

        res.status(200).json({
            message: 'Account updated successfully',
            account: updatedAccount
        });

    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const accountid = req.params.accountId;
        const userId = req.user.id;

       const deletedAccount = await account.findById(accountid);

        if (!deletedAccount) {
            return res.status(404).json({ message: 'Account not found or you do not have permission to delete it' });
        }

        if (deletedAccount.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this account' });
        }

        if(deletedAccount.balance > 0) {
            return res.status(400).json({ message: 'Cannot delete account with a positive balance' });
        }

        await deletedAccount.deleteOne();

        res.status(200).json({
            message: 'Account deleted successfully',
            account: deletedAccount
        });

    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



module.exports = {
  createAccount,
  getMyUserAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount,
};