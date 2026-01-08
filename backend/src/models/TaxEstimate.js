//import mongoose from "mongoose"
const mongoose = require("mongoose");
const taxEstimateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quarter: {
        type: String,
        required: true
    },
    estimatedTax: {
        type: Number,
        required: true
    }
}, {timestamps: true}
);

module.exports = mongoose.model("TaxEstimate", taxEstimateSchema);

//export default mongoose.model("TaxEstimate", taxEstimateSchema);