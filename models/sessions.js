const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionsSchema = new Schema({
    metadataId: {
        type: Schema.Types.ObjectId,
        ref: "Metadata",
        required: [true, "metadata id is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"]
    },
    open: {
        type: Number,
        required: [true, "Opening price of equity is required"]
    },
    high: {
        type: Number,
        required: [true, "High of equity is required"]
    },
    low: {
        type: Number,
        required: [true, "Low of equity is required"]
    },
    close: {
        type: Number,
        required: [true, "Closing price of equity is required"]
    },
    adjClose: {
        type: Number,
        required: [true, "Adjacent closing price of equity is required"]
    },
    volume: {
        type: Number,
        required: [true, "Volume of equity is required"]
    }
},
  {
    timestamps: true
  }
);

const Sessions = mongoose.model("Sessions", sessionsSchema);

module.exports = Sessions;