const mongoose = require('mongoose');
const moment = require('moment');

const printedRequestSchema = new mongoose.Schema({
  printerCode: {
    type: String,
    ref: "Printer",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    require: true
  },
  date: {
    type: String,
    default: moment().format('DD/MM/YYYY')
  },
  time: {
    type: String,
	default: moment().format('HH:mm:ss')
  },
  paperSize: {
    type: String,
    required: true
  },
  orientation: {
    type: String,
    enum: ["Hướng dọc", "Hướng ngang"],
    default: "Hướng dọc"
  },
  pagesPrinted: {
    type: Number,
    required: true
  },
  copies:{
	type: Number,
	require: true,
	default: 1
  },
  fileName: {
    type: String,
    required: true
  },
  printerName: {
    type: String,
    required: true
  },
  Display: {
    type: String,
    enum: ["1 mặt", "2 mặt"],
    default: "1 mặt"
  }
}, { timestamps: true });

module.exports = mongoose.model('PrintedRequest', printedRequestSchema);
