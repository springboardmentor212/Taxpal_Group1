const taxSlabs = {
    India: [
        { upto: 400000, rate: 0 },
        { upto: 800000, rate: 0.05 },
        { upto: 1200000, rate: 0.10 },
        { upto: 1600000, rate: 0.15 },
        { upto: 2000000, rate: 0.20 },
        { upto: 2400000, rate: 0.25 },
        { upto: Infinity, rate: 0.30 }
    ],
    USA: [
        { upto: 10000, rate: 0.10 },
        { upto: 40000, rate: 0.12 },
        { upto: 85000, rate: 0.22 },
        { upto: Infinity, rate: 0.24 }
    ]
};
module.exports = {taxSlabs};