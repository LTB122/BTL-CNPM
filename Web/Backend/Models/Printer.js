const mongoose = require('mongoose');

const printerSchema = new mongoose.Schema({
  printerCode: {
    type: String,
    required: true
  },
  printerName: {
    type: String,
    required: true
  },
  dateOfProduct: {
    type: String,
    require: true
  },
  brand: {
    type: String,
    require: true
  },
  company: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ["Hoạt động", "Đang bảo trì"],
    default: "Hoạt động"
  },
  systemInTime: {
    type: String,
    default: Date.now
  },
  allowedFileFormat: {
    type: [String],
    default: ["pdf", "doc"]
  },
  place: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Printer', printerSchema);
