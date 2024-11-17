const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mssv: { type: String, required: true },
    sdt: { type: String },
    date: { type: Date, required: true, default: Date.now },
    department: { type: String, required: true },
    number_pager: { type: Number, required: true, default: 0 },
    avatar: { type: String }  // Lưu URL của hình ảnh avatar
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

