const Payment = require('../Models/Payment');

// Hàm tạo thanh toán mới
exports.createPayment = async (req, res) => {
    try {
        const { userId, noiDung, soTo, daThanhToan } = req.body;

        // Giả sử mỗi số tờ có giá trị 2,000 VND
        const giaTriTaoThanhToan = 2000;
        const soTien = soTo * giaTriTaoThanhToan; // Tính số tiền từ số tờ
        const conLai = soTien - daThanhToan; // Tính số tiền còn lại

        const newPayment = new Payment({
            userId,
            noiDung,
            soTo,
            soTien,
            daThanhToan,
            conLai
        });

        await newPayment.save();
        res.status(201).json(newPayment); // Trả về thông tin thanh toán đã tạo
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Hàm lấy tất cả thanh toán của người dùng
exports.getUserPayments = async (req, res) => {
    try {
        const userId = req.params.userId;
        const payments = await Payment.find({ userId });
        if (!payments) {
            return res.status(404).json({ message: 'Không có thông tin thanh toán.' });
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
