const Printer = require('../../../../../../du_an_the_band/tam/Frontend/Web/Backend/Models/PrintLog');
const Payment = require('../../../../../../du_an_the_band/tam/Frontend/Web/Backend/Models/Payment');

//Hàm tạo đơn in mới

exports.createPrintLog = async (req, res) => {
    try{
        const {orderCode, printerCode, UserName, paperSize, orientation, pagesPrinted, fileName, totalPrice} = req.body;

        const newPrintedDemand = new Printer({
            orderCode,
            printerCode,
            UserName,
            paperSize,
            orientation,
            pagesPrinted,
            fileName,
            totalPrice
        });

        await newPrintedDemand.save();
        res.status(201).json(newPrintedDemand);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}