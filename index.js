if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const mongoURL = process.env.MONGODB_URL;
const { Data } = require('./model/dataModel');
const cors = require("cors");

const allowedOrigins = [
    'chrome-extension://fkmdnmdodhippleeocffkgphkbfmnjei',
    'https://leet-comp.vercel.app/',
    'chrome-extension://hnhidjjgkdmnejolifgaedellilhokcj' // Your actual Chrome extension ID
];

const corsConfig = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization','Access-Control-Allow-Origin'],
    credentials: true
};

app.use(cors(corsConfig));
app.use(express.json());


app.post("/company", async (req, res) => {
    const { questionId } = req.body;
    
    if (questionId) {
        try {
            // Find all documents that match the questionId
            const companies = await Data.find({ questionId: questionId }).exec();

            // Check if any companies are found
            if (companies.length > 0) {
                // Aggregate company names from all documents
                const allCompanyNames = companies.flatMap(company => company.companyName);
                res.json({ companyNames: allCompanyNames });
            } else {
                res.json({ message: "No companies found for this question ID." });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    } else {
        res.status(400).json({ message: "Invalid request, questionId is required" });
    }
});

app.get("/", (req, res) => {
    res.json({ message: "welcome" });
});

app.listen(port, () => {
    console.log("app listening to port " + port);
    mongoose.connect(mongoURL).then(() => {
        console.log("DBConnected");
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = app;
