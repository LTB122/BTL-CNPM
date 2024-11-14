const PrintLog = require('../Models/PrintLog');
const Printer = require('../Models/Printer');

//Hàm tạo đơn in mới
exports.createPrintLog = async (req, res) => {
    try{
        const {paperSize, orientation, pagesPrinted, fileName, display, printerCode} = req.body;
        let printerName;
        const printerUsed = await Printer.findOne({printerCode: printerCode});
    
        if(!printerUsed){
            return res.status(404).json({message: "không tìm thấy máy in này"});
        }
        
        printerName = printerUsed.printerName;

        const newPrintedDemand = new PrintLog({
            orderCode: req.user.userID,
            printerCode,
            UserName: req.user.username,
            paperSize,
            orientation,
            pagesPrinted,
            fileName,
            printerName,
            display
        });

        await newPrintedDemand.save();
        res.status(201).json(newPrintedDemand);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

//Kiểm tra toàn bộ lịch sử của toàn bộ người dùng
exports.GetAllPrintHistory = async (req, res) => {
    try{
        const printHistory = await PrintLog.find();
        res.status(200).json(printHistory);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

exports.GetAccountPrintHistory = async (req, res) => {
    try{
        const hell0 = 1;

    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}