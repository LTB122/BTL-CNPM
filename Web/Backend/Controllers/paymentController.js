const Payment = require("../Models/Payment");

// Tạo thanh toán mới cho người dùng đã đăng nhập
exports.createPayment = async (req, res) => {
	try {
		const { noiDung, soTo, daThanhToan } = req.body;
		// Giả sử mỗi tờ có giá trị 2,00 VND
		const giaTriTaoThanhToan = 200;
		const soTien = soTo * giaTriTaoThanhToan; // Tính số tiền từ số tờ
		let thanhToan = daThanhToan;
		if (isNaN(daThanhToan)) {
			thanhToan = 0;
		}
		const conLai = soTien - thanhToan; // Tính số tiền còn lại

		const newPayment = new Payment({
			userId: req.user.userId, // lấy userId từ token đã giải mã
			noiDung,
			soTo,
			soTien,
			thanhToan,
			conLai,
		});

		await newPayment.save();
		res.status(201).json(newPayment); // Trả về thông tin thanh toán đã tạo
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Lấy tất cả thanh toán của người dùng đã đăng nhập
exports.getUserPayments = async (req, res) => {
	try {
		const payments = await Payment.find({ userId: req.user.userId });
		if (!payments || payments.length === 0) {
			return res
				.status(404)
				.json({ message: "Không có thông tin thanh toán." });
		}
		res.status(200).json(payments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Cập nhật số tiền đã thanh toán cho một thanh toán
exports.updatePayment = async (req, res) => {
	try {
		const { paymentId } = req.params;
		const { daThanhToan } = req.body; // Số tiền mới đã thanh toán

		// Lấy thông tin thanh toán hiện tại
		const payment = await Payment.findById(paymentId);
		if (!payment) {
			return res
				.status(404)
				.json({ message: "Thanh toán không tồn tại." });
		}

		// Tính số tiền đã thanh toán mới và số tiền còn lại
		let thanhToan = daThanhToan;
		if (isNaN(daThanhToan)) {
			thanhToan = payment.daThanhToan; // Nếu đầu vào không hợp lệ, giữ nguyên số tiền đã thanh toán hiện tại
		}

		const conLai = payment.soTien - thanhToan;

		// Cập nhật thanh toán với số tiền đã thanh toán và số tiền còn lại mới
		payment.daThanhToan = thanhToan;
		payment.conLai = conLai;

		await payment.save();
		res.status(200).json(payment); // Trả về thông tin thanh toán đã cập nhật
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
