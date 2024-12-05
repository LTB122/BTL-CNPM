const Printer = require("../Models/Printer");

//Hàm tạo đơn in mới

exports.createPrintLog = async (req, res) => {
	try {
		const {
			orderCode,
			printerCode,
			UserName,
			paperSize,
			orientation,
			pagesPrinted,
			fileName,
			totalPrice,
		} = req.body;

		const newPrintedDemand = new Printer({
			orderCode,
			printerCode,
			UserName,
			paperSize,
			orientation,
			pagesPrinted,
			fileName,
			totalPrice,
		});

		await newPrintedDemand.save();
		res.status(201).json(newPrintedDemand);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Hàm tạo máy in mới
exports.addNewPrinter = async (req, res) => {
	try {
		const {
			printerCode,
			printerName,
			dateOfProduct,
			brand,
			company,
			condition,
			systemInTime,
			allowedFileFormat,
			place,
		} = req.body;

		const newPrinter = new Printer({
			printerCode,
			printerName,
			dateOfProduct,
			brand,
			company,
			condition,
			systemInTime,
			allowedFileFormat,
			place,
		});

		if (await Printer.findOne({ printerCode: newPrinter.printerCode })) {
			return res
				.status(404)
				.json({ message: "máy in đã tồn tại trong hệ thống" });
		}

		await newPrinter.save();
		res.status(201).json(newPrinter);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

//Hàm xem thông tin toàn bộ máy in trong hệ thống
exports.GetAllPrinter = async (req, res) => {
	try {
		const AllPrinter = await Printer.find();
		res.status(200).json(AllPrinter);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

//Hàm trả về thông tin của một máy in cụ thể
exports.GetOnePrinter = async (req, res) => {
	try {
		const printers = await Printer.find({ _id: req.params.printerID });
		if (!printers) {
			return res.status(404).json({ message: "máy in không tồn tại" });
		}
		res.status(200).json(printers);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

//Hàm cập nhật thông tin của một máy in cụ thể
exports.UpdatePrinter = async (req, res) => {
	try {
		const printerID = req.params.printerID;
		const printerInfo = req.body;

		const printer = await Printer.findByIdAndUpdate(
			printerID,
			{ $set: printerInfo },
			{ new: true, runValidators: true }
		);

		if (!printer) {
			return res.status(404).json({ message: "Máy in không tồn tại." });
		}
		// else{
		//     console.log("existed");
		//     // res.json({place: printer.place});
		// }
		res.status(200).json(printer);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
//Hàm xóa đi một máy in ra khỏi hệ thống
exports.DeletePrinter = async (req, res) => {
	try {
		const printerID = req.params.printerID;

		const deletedPrinter = await Printer.findByIdAndDelete(printerID);
		if (!deletedPrinter) {
			return res
				.status(404)
				.json({ message: "Máy in không được tìm thấy" });
		}
		res.status(200).json({
			message: "Xóa máy in thành công",
			printer: deletedPrinter,
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
