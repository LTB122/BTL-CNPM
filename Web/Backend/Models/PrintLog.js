const mongoose = require("mongoose");

const printedRequestSchema = new mongoose.Schema(
	{
		printerCode: {
			type: String,
			required: true,
		},
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		userName: {
			type: String,
			require: true,
		},
		date: {
			type: String,
			default: Date.now,
		},
		time: {
			type: String,
		},
		paperSize: {
			type: String,
			required: true,
		},
		orientation: {
			type: String,
			enum: ["Hướng dọc", "Hướng ngang"],
			default: "Hướng dọc",
		},
		pagesPrinted: {
			type: Number,
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
		printerName: {
			type: String,
			required: true,
		},
		Display: {
			type: String,
			enum: ["1 mặt", "2 mặt"],
			default: "1 mặt",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("PrintedRequest", printedRequestSchema);
