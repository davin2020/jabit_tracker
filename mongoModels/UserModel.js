const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//access_token isnt needed as part of db schema, only GQL
const userSchema = new Schema({
    email: String,
    fullname: String,
    password: String,
    dream_job: String,
    motivation: String,
    total_points: Number
});

//first param is name of relevant collection in MongoDB where data is saved
module.exports = mongoose.model('users', userSchema);