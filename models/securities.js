const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const securitiesSchema = new Schema({
    nasdaqTraded: {
        trim: true,
        type: String,
        default: "N"
    },
    symbol: {
        trim: true,
        type: String,
        required: [true, "Symbol is required"]
    },
    securityName: {
        trim: true,
        type: String,
        required: [true, "Security name is required"]
    },
    listingExchange: {
        trim: true,
        type: String
    },
    marketCategory: {
        trim: true,
        type: String
    },
    etf: {
        trim: true,
        type: String,
        default: "N"
    },
    roundLotSize: {
        type: Number,
        required: [true, "Round lot size is required"]
    },
    testIssue: {
        trim: true,
        type: String,
        default: "N"
    },
    financialStatus: {
        trim: true,
        type: String
    },
    cqsSymbol: {
        trim: true,
        type: String
    },
    nasdaqSymbol: {
        trim: true,
        type: String
    },
    nextShares: {
        trim: true,
        type: String,
        default: "N"
    }
},
  {
    timestamps: true
  }
);

const Securities = mongoose.model("Securities", securitiesSchema);

module.exports = Securities;