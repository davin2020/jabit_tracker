const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ISSUE doesnt work if userid is mongoose.ObjectId, has to be String
const goalSchema = new Schema({
	userid: String,
    name: String,
    is_target_type: Boolean,
    target_amount_goal: Number,
    target_unit: String,
    target_amount_completed: Number,
    points: Number,
    is_completed: Boolean,
    is_deleted: Boolean
});

//first param is name of relevant collection in MongoDB where data is saved
module.exports = mongoose.model('goals', goalSchema);


