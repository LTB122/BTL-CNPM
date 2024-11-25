function loadTransactionDetails() {
    const transactionData = JSON.parse(sessionStorage.getItem('selectedHistory'));

    if (!transactionData) {
        document.querySelector('.transaction-details').innerHTML = "<p>Không có dữ liệu.</p>";
        return;
    }

    document.querySelector('.transaction-details').innerHTML = `
        <div class="print-detail">
            <table>
                <tbody>
                    <tr>
                        <th>Mã đơn in: <span class="history-detail">${transactionData.orderCode}</span></th>
                        <th>Thời gian: <span class="history-detail">${transactionData.time} - ${formatDate(transactionData.date)}</span></th>
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

            <div class="total-price">Tổng tiền: ${transactionData.totalPrice}</div>
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

document.addEventListener('DOMContentLoaded', loadTransactionDetails);