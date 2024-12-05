const PrintLog = require('../Models/PrintLog');
const Printer = require('../Models/Printer');
const User = require('../Models/User');

//Hàm tạo đơn in mới
exports.createPrintLog = async (req, res) => {
    try{
        const {paperSize, orientation, pagesPrinted, fileName, copies, display} = req.body;
        const printerID = req.params.printerID;
        
        let printerNameCheck, printerCodeCheck;
        const printerUsed = await Printer.findOne({printerCode: printerID});
       
        if(!printerUsed){
            return res.status(404).json({message: "không tìm thấy máy in này"});
        }

        if(!printerUsed.allowedFileFormat.some(format => fileName.endsWith(`.${format}`))){
            return res.status(401).json({message: "Máy in không thể in file in có định dạng này, vui lòng đổi định dạng file"})
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
            copies,
            fileName,
            printerName: printerNameCheck,
            display
        });

        const user = await User.findOne({_id: req.user.userId})

        if(user && user.number_pager >= pagesPrinted*copies){
            await User.findOneAndUpdate({_id: req.user.userId},{ $inc: { number_pager: -(pagesPrinted*copies)}});
            const newUser = await User.findOne({_id: req.user.userId});
            if(newUser) console.log(`Số trang in hiện tại còn lại là: ${newUser.number_pager} `) 
        }
        else{
            res.status(401).json({message: "Số lượng giấy không đủ để thực hiện đơn in"});
            alert("Số trang in hiện tại trong hệ thống không đủ để thực hiện đơn in này")
        }

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


exports.GetAccountPrintHistoryForAdmin = async (req, res) => {
    try{
        const printHistory = await PrintLog.find({userID: req.params.userID});
        console.log(printHistory)
        res.status(200).json(printHistory);
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}

//Lấy toàn bộ danh sách lịch sử in ấn của tài khoản đó
exports.GetAccountPrintHistory = async (req, res) => {
    try{
        // console.log(req.user)
        const printHistory = await PrintLog.find({userID: req.user.userId});
        // console.log(printHistory)
        res.status(200).json(printHistory);
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}