//const Transaction = require ("../models/Transaction");
//const TaxEstimate = require ("../models/TaxEstimate");
//const {taxSlabs} = require ("../utils/taxSlabs");
const {calculateTax} = require ("../utils/calculateTax");

const estimatedQuarterlyTax = async (req, res) => {
    try{
        const {country, quarter, income, deductions} = req.body;
        if (!country || !quarter || !income){
            return res.status(400).json({error: "Missing required fields"});
        }

        const result = calculateTax ({
            country,
            income,
            deductions,
            quarter,
        });

        res.json(result);
        /*const {quarter} = req.query;
        const userId = req.user.id;
        const country = req.user.country;

        const slabs = taxSlabs[country];
        const transactions = await Transaction.find({
            user: userId,
            type: "income"
        });
        const totalIncome = transaction.reduce((sum, t) => sum + t.amount, 0 );
        const estimatedTax = calculateTax(totalIncome, slabs);
        await TaxEstimate.create({
            userId,
            quarter,
            estimatedTax
        });
        res.json({quarter, totalIncome, estimatedTax});*/

    }
    catch(err){
        console.error("Tax calculation error:", err);
        res.status(500).json({error: "Tax calculation failed"});
    }
};
module.exports = {estimatedQuarterlyTax};