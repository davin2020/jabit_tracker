const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ISSUE doesnt work if userid is mongoose.ObjectId, has to be String
// re Mongoose Timestamps - When you enable timestamps, Mongoose adds createdAt and updatedAt properties to your schema. By default, createdAt and updatedAt are of type Date. When you update a document, Mongoose automatically increments updatedAt.
//thsi works to save as object id!
const goalSchema = new Schema({
	userid: mongoose.Types.ObjectId,
    name: String,
    is_target_type: Boolean,
    target_amount_goal: Number,
    target_unit: String,
    target_amount_completed: Number,
    points: Number,
    is_completed: Boolean,
    is_deleted: Boolean
},
	{ timestamps: true }
);

//first param is name of relevant collection in MongoDB where data is saved
module.exports = mongoose.model('goals', goalSchema);
