let data = [];

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

async function fetchDataFromServer() {
    try {
        const response = await authenticatedFetch('http://localhost:3000/api/payment/get-payments',{
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Gán dữ liệu từ server vào biến data
        data = await response.json(); // Server trả về các mục có cả id

        // Gọi hàm điền dữ liệu vào bảng
        populateTable();
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
        checkbox.setAttribute("data-id", item._id); // Gắn id vào checkbox
        
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
async function confirmPayment() {
    const checkboxes = document.querySelectorAll('.circle-checkbox');
    
    checkboxes.forEach(async (checkbox) => {
        if (checkbox.checked && !checkbox.disabled) {
            const paymentId = checkbox.getAttribute("data-id"); // Lấy id từ thuộc tính data-id
            const payment = data.find(item => item._id === paymentId); // Tìm mục tương ứng trong data
            
            if (payment) {
                // Cập nhật dữ liệu "Đã thanh toán" và "Còn lại" trong giao diện
                const row = checkbox.closest('tr');
                const daThanhToanCell = row.cells[2];
                const conLaiCell = row.cells[3];
                const soTien = payment.soTien;

                daThanhToanCell.innerText = soTien.toLocaleString();
                conLaiCell.innerText = '0';
                const updatedData = {
                    daThanhToan: soTien,
                }
                console.log("Dữ liệu cập nhật lên máy chủ: ", updatedData);
                // Gửi dữ liệu cập nhật lên máy chủ
                try {
                    const response = await fetch(`http://localhost:3000/api/payment/update-payment/${paymentId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    });
                    
                    if (!response.ok) {
                        throw new Error('Cập nhật thất bại');
                    }
                    
                    const updatedPayment = await response.json();
                    console.log('Sau khi cập nhật thành công:', updatedPayment);

                    await fetchDataFromServer();
                } catch (error) {
                    console.error('Lỗi khi cập nhật dữ liệu:', error);
                    alert('Đã xảy ra lỗi khi cập nhật dữ liệu.');
                }
            }
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