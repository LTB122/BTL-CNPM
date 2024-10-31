const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mssv: {type: String, require: true},
    sdt: {type: String},
    department: {type: String, require: true}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
