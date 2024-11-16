const PrintLog = require('../Models/PrintLog');
const Printer = require('../Models/Printer');

//Hàm tạo đơn in mới
exports.createPrintLog = async (req, res) => {
    try{
        const {paperSize, orientation, pagesPrinted, fileName, display} = req.body;
        const printerID = req.params.printerID;
        
        let printerNameCheck, printerCodeCheck;
        const printerUsed = await Printer.findOne({_id: printerID});
       
        if(!printerUsed){
            return res.status(404).json({message: "không tìm thấy máy in này"});
        }

        printerNameCheck = printerUsed.printerName;
        printerCodeCheck = printerUsed.printerCode;

        const newPrintedDemand = new PrintLog({
            printerCode: printerCodeCheck,
            userID: req.user.userId,
            userName: req.user.username,
            paperSize,
            orientation,
            pagesPrinted,
            fileName,
            printerName: printerNameCheck,
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