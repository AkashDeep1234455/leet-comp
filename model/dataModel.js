const {model} = require('mongoose');
const {dataSchema} = require('../Schemas/dataSchema');

const Data = new model("Data",dataSchema);
module.exports = {Data};