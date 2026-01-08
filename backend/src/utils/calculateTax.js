const {taxSlabs} = require("../utils/taxSlabs");
function calculateTax({country, income, deductions}) {
    const slabs = taxSlabs[country];
    if (!slabs) throw new Error("Invalid country");

    const totalDeductions =
        (deductions?.business || deductions?.buisness || 0) +
        (deductions?.retirement || 0) +
        (deductions?.health || 0) +
        (deductions?.homeOffice || 0);

    let taxableIncome = Math.max(0, income - totalDeductions);

    let tax = 0;
    let previous = 0;

    for(const slab of slabs){
        const limit = slab.upto;
        const applicableIncome = Math.min(taxableIncome, limit - previous);
        if (applicableIncome <= 0) 
            break;
        tax += applicableIncome * slab.rate;
        taxableIncome -= applicableIncome;
        previous = limit;

        /*if(income > slab.upto){
            tax += (slab.upto - previous) * slab.rate;
            previous = slab.upto;
        }
        else{
            tax += (income - previous) * slab.rate;
            break;
        }*/
    }
    return {
        taxableIncome: income - totalDeductions,
        estimatedTax: (tax / 4) ,
    };
}
module.exports = {calculateTax};