const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Link to the User model (each payment is related to a user)
        required: true
    },
    noiDung: { 
        type: String, 
        required: true 
    },
    soTo: { 
        type: Number, 
        required: true, // Số tờ, bắt buộc phải có
    },
    soTien: { 
        type: Number, 
        required: true, // Số tiền sẽ được tính từ số tờ
    },
    daThanhToan: { 
        type: Number, 
        default: 0, // Default is 0, representing the amount already paid
        required: true 
    },
    conLai: { 
        type: Number, 
        required: true 
    },
    ngayThanhToan: { 
        type: Date, 
        default: Date.now, // Default is the current date/time
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
