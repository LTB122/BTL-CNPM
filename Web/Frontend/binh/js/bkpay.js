let data = [];

// Hàm lấy dữ liệu từ máy chủ
async function fetchDataFromServer() {
    try {
        const response = await fetch('https://example.com/api/data'); // Thay URL bằng API của máy chủ
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json(); // Lưu dữ liệu từ máy chủ vào biến data
        populateTable(); // Gọi hàm để điền dữ liệu vào bảng
    } catch (error) {
        console.error('Có lỗi khi lấy dữ liệu từ máy chủ:', error);
    }
}

// Hàm điền dữ liệu vào bảng
function populateTable() {
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = ""; // Xóa nội dung cũ trong bảng

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Tạo các ô dữ liệu
        const noiDungCell = document.createElement("td");
        noiDungCell.textContent = item.noiDung;
        
        const soTienCell = document.createElement("td");
        soTienCell.textContent = item.soTien.toLocaleString();
        
        const daThanhToanCell = document.createElement("td");
        daThanhToanCell.textContent = item.daThanhToan.toLocaleString();
        
        const conLaiCell = document.createElement("td");
        conLaiCell.textContent = item.conLai.toLocaleString();

        // Tạo ô checkbox
        const checkboxCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "circle-checkbox";
        
        // Nếu "Còn lại" = 0, tự động tick và vô hiệu hóa checkbox
        if (item.conLai === 0) {
            checkbox.checked = true;
            checkbox.disabled = true;
            checkbox.classList.add('confirmed');
        }

        // Thêm checkbox vào ô
        checkboxCell.appendChild(checkbox);

        // Thêm các ô vào hàng
        row.appendChild(noiDungCell);
        row.appendChild(soTienCell);
        row.appendChild(daThanhToanCell);
        row.appendChild(conLaiCell);
        row.appendChild(checkboxCell);

        // Thêm hàng vào bảng
        tableBody.appendChild(row);
    });
}

// Hàm hiển thị modal mã QR khi nhấn nút "Thanh toán"
function openModal() {
    const checkboxes = document.querySelectorAll('.circle-checkbox');
    let anyChecked = false;
    
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked && !checkbox.disabled) {
            anyChecked = true;
        }
    });

    if (anyChecked) {
        generateQRCode("https://bkpay.hcmut.edu.vn/bkpay/home.action");
        document.getElementById("qrModal").style.display = "flex";
    } else {
        alert("Vui lòng chọn ít nhất một mục để thanh toán.");
    }
}

// Hàm tạo mã QR
function generateQRCode(url) {
    const qrCodeContainer = document.getElementById("qrCode");
    qrCodeContainer.innerHTML = ""; // Xóa QR cũ (nếu có)

    new QRCode(qrCodeContainer, {
        text: url,
        width: 200,
        height: 200,
    });
}

// Hàm xử lý khi nhấn nút "Xác nhận" trong modal
function confirmPayment() {
    const checkboxes = document.querySelectorAll('.circle-checkbox');
    
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked && !checkbox.disabled) {
            checkbox.classList.add('confirmed');
            checkbox.disabled = true;

            // Cập nhật dữ liệu "Đã thanh toán" và "Còn lại"
            const row = checkbox.closest('tr');
            const daThanhToanCell = row.cells[2];
            const conLaiCell = row.cells[3];
            const soTien = data[index].soTien;

            daThanhToanCell.innerText = soTien.toLocaleString();
            conLaiCell.innerText = '0';
        }
    });

    closeModal();
}

// Hàm đóng modal
function closeModal() {
    document.getElementById("qrModal").style.display = "none";
}

// Khởi tạo bảng khi tải trang
window.onload = () => {
    fetchDataFromServer(); // Lấy dữ liệu từ máy chủ khi tải trang
};