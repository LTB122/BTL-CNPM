let totalA4Initial = 0;
let totalA3Initial = 0;

// Hàm lấy dữ liệu từ máy chủ
async function fetchHistoryData() {
    try {
        const response = await fetch('https://example.com/api/printHistory'); // URL API
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Có lỗi khi lấy dữ liệu từ máy chủ:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
}

// Hàm hiển thị lịch sử in
function displayHistory(historyList) {
    const sortedHistoryList = historyList.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeB - dateTimeA;
    });

    const container = document.querySelector('.container');
    container.innerHTML = ''; // Xóa lịch sử hiện tại

    sortedHistoryList.forEach(history => {
        const formattedDate = formatDate(history.date);
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <div class="history-info">
                <div>Mã đơn in: <span class="history-detail">${history.orderCode}</span></div>
                <div>Mã máy in: <span class="history-detail">${history.printerCode}</span></div>
                <div>Tài khoản thực hiện: <span class="history-detail">${history.userName}</span></div>
            </div>
            <div class="history-info">    
                <div>Thời gian: <span class="history-detail">${history.time}</span></div>
                <div>Ngày in: <span class="history-detail">${formattedDate}</span></div>
            </div>
            <button class="detail-btn">Xem chi tiết</button>
        `;
        container.appendChild(historyItem);
    });
}

// Hàm chuyển đổi định dạng ngày từ yyyy-mm-dd sang dd/mm/yyyy
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Tính tổng số trang A4 và A3 từ dữ liệu máy chủ
function calculateTotals(historyList) {
    totalA4Initial = 0;
    totalA3Initial = 0;
    historyList.forEach(history => {
        if (history.paperSize === "A4") {
            totalA4Initial += history.pagesPrinted;
        } else if (history.paperSize === "A3") {
            totalA3Initial += history.pagesPrinted;
        }
    });
}

// Cập nhật bảng tổng kết với tổng số trang đã in từ dữ liệu máy chủ
function updateSummaryTable() {
    document.getElementById("totalA4").textContent = totalA4Initial;
    document.getElementById("totalA3").textContent = totalA3Initial;
}

// Tìm kiếm và lọc dữ liệu theo ngày
document.querySelector('.search-btn').addEventListener('click', async () => {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    
    const historyData = await fetchHistoryData();
    
    if (!startDateInput && !endDateInput) {
        // Hiển thị toàn bộ dữ liệu nếu không có điều kiện tìm kiếm
        displayHistory(historyData);
    } else {
        // Lọc theo ngày nếu có điều kiện tìm kiếm
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);

        const filteredData = historyData.filter(history => {
            const historyDate = new Date(history.date);
            return historyDate >= startDate && historyDate <= endDate;
        });

        if (filteredData.length === 0) {
            alert("Không tìm thấy kết quả nào trong khoảng thời gian đã chọn.");
        } else {
            displayHistory(filteredData);
        }
    }
});

// Khởi tạo trang với dữ liệu và bảng tổng kết từ máy chủ
document.addEventListener('DOMContentLoaded', async () => {
    const historyData = await fetchHistoryData();
    displayHistory(historyData);
    calculateTotals(historyData);
    updateSummaryTable();
});