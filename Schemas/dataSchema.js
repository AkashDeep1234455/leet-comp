const {Schema} = require('mongoose');

const dataSchema = new Schema({
    questionId:{
        type:Number,
        required:true,
        unique:true,
    },
    companyName:[{
        type:String,
    }]
})

module.exports = {dataSchema}