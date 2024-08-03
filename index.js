if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT||8080;
const mongoURL = process.env.MONGODB_URL;
const {Data} = require('./model/dataModel');

const data = require('./output.json');


app.get('/insertData',async (req,res)=>{
    try {
        for (const [questionId, companyNames] of Object.entries(data)) {
            await Data.findOneAndUpdate(
                { questionId: parseInt(questionId) },
                { companyName: companyNames },
                { upsert: true,new:true }
            );
        }
        res.send('Data inserted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})








app.listen(port,()=>{
    console.log("app listening to port "+port);
    mongoose.connect(mongoURL).then(()=>{
        console.log("DBConnected");
    })
    .catch((err)=>{
        console.log(err);
    })
})