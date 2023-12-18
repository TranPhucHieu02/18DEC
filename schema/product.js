var mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email:String,
    descritption: String,
    image: String,
    price: Number,
});

module.exports = mongoose.model('product', schema);;

