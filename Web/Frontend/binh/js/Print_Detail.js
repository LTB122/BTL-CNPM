function loadTransactionDetails() {
    const transactionData = JSON.parse(sessionStorage.getItem('selectedHistory'));

    if (!transactionData) {
        document.querySelector('.transaction-details').innerHTML = "<p>Không có dữ liệu.</p>";
        return;
    }

    // Hàm tính tổng tiền
    function calculateTotalPrice(paperSize, pagesPrinted) {
        const pricePerPageA4 = 200;
        const pricePerPageA3 = 400;

        if (paperSize === 'A4') {
            return pagesPrinted * pricePerPageA4;
        } else {
            return pagesPrinted * pricePerPageA3;
        }
    }

    // Tính tổng tiền dựa trên loại giấy và số trang
    const totalPrice = calculateTotalPrice(transactionData.paperSize, transactionData.pagesPrinted);

    // Định dạng tổng tiền với dấu chấm
    const formattedTotalPrice = formatNumberWithDots(totalPrice);

    document.querySelector('.transaction-details').innerHTML = `
        <div class="print-detail">
            <table>
                <tbody>
                    <tr>
                        <th>Mã đơn in: <span class="history-detail">${truncateString(transactionData._id)}</span></th>
                        <th>Thời gian: <span class="history-detail">${transactionData.time} - ${formatDate(transactionData.createdAt.slice(0,10))}</span></th>
                    </tr>
                    <tr>
                        <th>Mã máy in: <span class="history-detail">${transactionData.printerCode}</span></th>
                        <th>Khổ giấy: <span class="history-detail">${transactionData.paperSize} - ${transactionData.orientation}</span></th>
                    </tr>
                    <tr>
                        <th>Số trang: <span class="history-detail">${transactionData.pagesPrinted}</span></th>
                        <th>Tên file: <span class="history-detail" id="fileName">${transactionData.fileName}</span></th>
                    </tr>
                </tbody>
            </table>

            <div class="total-price">Tổng tiền: ${formattedTotalPrice} VND</div>
        </div>
        
        <div class="user-info">
            <image class="avatar" src="https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg" alt="">
            <p class="history-detail">${transactionData.userName}</p>
            <button class="access-btn">Truy cập</button>
        </div>
    `;
}

//Hàm quay trở về trang Lịch sử in
function goBack() {
    window.location.href = 'Print_History.html';
}

// Hàm chuyển đổi định dạng ngày từ yyyy-mm-dd sang dd/mm/yyyy
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

//Hàm cắt chuỗi
function truncateString(str) {
    // Kiểm tra nếu chuỗi dài hơn 10 ký tự
    if (str.length > 10) {
        // Lấy 4 ký tự đầu, thêm dấu "..." và lấy 4 ký tự cuối
        return str.slice(0, 4) + '...' + str.slice(-4);
    }
    // Nếu chuỗi không quá dài, trả về chuỗi gốc
    return str;
}

// Hàm định dạng tiền
function formatNumberWithDots(number) {
    return number.toLocaleString('vi-VN');  // Định dạng theo chuẩn tiếng Việt
}

document.addEventListener('DOMContentLoaded', loadTransactionDetails);