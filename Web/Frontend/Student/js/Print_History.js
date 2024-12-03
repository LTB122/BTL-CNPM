let totalA4Initial = 0;
let totalA3Initial = 0;

function authenticatedFetch(url, options = {}) {
	const token = localStorage.getItem("token"); // Get token from localStorage

	const headers = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}
	const response = fetch(url, { ...options, headers });

	if (response.status === 401) {
		console.error(
			"Không được phép: Token có thể không hợp lệ hoặc đã hết hạn."
		);
	}

	return response;
}
// Hàm lấy dữ liệu từ máy chủ
async function fetchHistoryData() {
    try {
        const response = await authenticatedFetch('http://localhost:3000/api/printLog/getPrintHistory',{
            method: 'GET',
        });
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
        const dateTimeA = new Date(`${a.createdAt.slice(0,10)}T${a.time}`);
        const dateTimeB = new Date(`${b.createdAt.slice(0,10)}T${b.time}`);
        return dateTimeB - dateTimeA;
    });

    const container = document.querySelector('.container');
    container.innerHTML = ''; // Xóa lịch sử hiện tại

    sortedHistoryList.forEach(history => {
        const formattedDate = formatDate(history.createdAt.slice(0,10));
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <div class="history-info">
                <div>Mã đơn in: <span class="history-detail">${history._id}</span></div>
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

        //Gắn hàm viewDetail vào nút Xem chi tiết
        const detailButton = historyItem.querySelector('.detail-btn');
        detailButton.addEventListener('click', () => viewDetails(history));
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

// Tìm kiếm và lọc dữ liệu theo mã máy in và ngày
document.querySelector('.search-btn').addEventListener('click', async () => {
    const printerCodeInput = document.getElementById('printerCode').value.trim();
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;

    const historyData = await fetchHistoryData();

    if (!historyData || historyData.length === 0) {
        alert("Không có dữ liệu để hiển thị.");
        return;
    }

    // Lọc dữ liệu dựa trên mã máy in và ngày
    const filteredData = historyData.filter(history => {
        const matchesPrinter = printerCodeInput ? history.printerCode.includes(printerCodeInput) : true;
        
        let matchesDate = true;
        if (startDateInput || endDateInput) {
            const historyDate = new Date(history.createdAt.slice(0,10));
            if (startDateInput) {
                const startDate = new Date(startDateInput);
                matchesDate = matchesDate && historyDate >= startDate;
            }
            if (endDateInput) {
                const endDate = new Date(endDateInput);
                matchesDate = matchesDate && historyDate <= endDate;
            }
        }

        return matchesPrinter && matchesDate;
    });

    if (filteredData.length === 0) {
        alert("Không tìm thấy kết quả nào phù hợp.");
    }
    
    displayHistory(filteredData);
});

function viewDetails(history) { 
    // Save selected history data to session storage
    sessionStorage.setItem('selectedHistory', JSON.stringify(history));
    // Redirect to details page
    window.location.href = 'Print_Detail.html';
}

// Khởi tạo trang với dữ liệu từ mẫu
document.addEventListener('DOMContentLoaded', async () => {
    const historyData = await fetchHistoryData();
    displayHistory(historyData);
    calculateTotals(historyData);
    updateSummaryTable();
});