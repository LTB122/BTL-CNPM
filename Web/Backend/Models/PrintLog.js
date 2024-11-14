const mongoose = require('mongoose');

const printedRequestSchema = new mongoose.Schema({
  orderCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  printerCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Printer',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  },
  time: {
    type: String,
  },
  paperSize: {
    type: String,
    required: true
  },
  orientation: {
    type: String,
    enum: ["Hướng dọc", "Hướng ngang"],
    required: true
  },
  pagesPrinted: {
    type: Number,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  totalPrice: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('PrintedRequest', printedRequestSchema);
