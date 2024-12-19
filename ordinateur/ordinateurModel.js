var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ordinateur = new Schema({
    module : String,
    categorie : String,
    dateFabrication : Date,
    prix : Number,
})
module.exports = mongoose.model('ordinateurs', ordinateur)