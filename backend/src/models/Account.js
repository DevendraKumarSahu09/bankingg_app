import Joi from "joi";
import mongoose from "mongoose";
const { required } = Joi;

const transactionSchema = new mongoose.Schema({
    txnId: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ["deposit", "withdraw", "transfer"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed", "cancelled"],
        default: "success",
    },
});

// Account Schema
const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["savings", "current", "checking", "business", "investment"],
        required:true,
    },
    balance: {
        type: Number,
        required:true,
        default: 0,
    },
    status: {
        type: String,
        enum: ["active", "frozen", "suspended", "closed"],
        default: "active",
    },
    transactions:[transactionSchema],
});

export const Account = mongoose.model("Account", accountSchema)
export const Transaction = mongoose.model("Transaction", transactionSchema)
