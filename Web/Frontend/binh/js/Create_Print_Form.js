const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
let uploadedFile = null; // Biến để track file đã upload

// Xử lý kéo thả file
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
    const files = e.dataTransfer.files;
    handleFiles(files); //Xử lý file đã kéo thả
});

function handleFiles(files) {
    const file = files[0];
    if (file) {
        uploadedFile = file;
        const fileNameElement = document.getElementById("file-name");
        fileNameElement.textContent = file.name; // Hiển thị tên file
    }
}

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

function loadPrinters() {
    authenticatedFetch("http://localhost:3000/api/printer/printer", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((printers) => {
            const printerSelect = document.getElementById("printer");

            // Thêm các máy in vào lựa chọn
            printers.forEach((printer) => {
                const option = document.createElement("option");
                option.value = printer.printerCode;
                option.textContent = printer.printerName;
                option.dataset.place = printer.place;
                printerSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error loading printers:", error);
            const printerSelect = document.getElementById("printer");
            printerSelect.innerHTML = "<option value=''>Không có máy in khả dụng</option>";
            alert("Không thể tải danh sách máy in. Vui lòng thử lại.");
        });
}

function createOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Không tìm thấy token. Vui lòng đăng nhập trước.");
        alert("Vui lòng đăng nhập để mua thêm giấy.");
        return;
    }
    if (!uploadedFile) {
        alert("Vui lòng tải lên một file trước khi tạo đơn in.");
        return;
    }

    const paperSize = document.getElementById("paper-size").value;
    const orientation = document.querySelector('input[name="orientation"]:checked')?.value;
    const pages = document.getElementById("pages").value;
    const copies = document.getElementById("copies").value;
    const side = document.getElementById("side").value;
    const printer = document.getElementById("printer").value;
    const printerSelect = document.getElementById("printer");
    const selectedOption = printerSelect.options[printerSelect.selectedIndex];
    const place = selectedOption.dataset.place; 

    if (!orientation) {
        alert("Vui lòng chọn hướng in (Hướng dọc hoặc Hướng ngang).");
        return;
    }

    if (!pages || pages < 1 || pages > 999) {
        alert("Vui lòng nhập số trang hợp lệ (từ 1 đến 999).");
        return;
    }

    if (!copies || copies < 1 || copies > 999) {
        alert("Vui lòng nhập số lượng in hợp lệ (từ 1 đến 999).");
        return;
    }

    const fileName = document.getElementById("file-name").textContent;
    const updatedData = {
        "paperSize": paperSize,
        "orientation": orientation,
        "pagesPrinted": Number(pages),
        "copies": Number(copies),
        "Display": side,
        "fileName": fileName
    };
    
    fetch(`http://localhost:3000/api/printLog/printRequest/${printer}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    })
    .then((response) => {
        if (response.ok) {
            const now = new Date();
            const formattedTime = formatDateTime(now);

            document.getElementById("modal-printer").textContent = printer;
            document.getElementById("modal-place").textContent = place;
            document.getElementById("modal-time").textContent = formattedTime;
            document.getElementById("success-modal").style.display = "flex";
        } else {
            alert("Đã xảy ra lỗi khi tạo đơn in. Vui lòng thử lại.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Không thể kết nối tới máy chủ.");
    });
}

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}

// Tắt modal
function closeModal() {
    document.getElementById("success-modal").style.display = "none";
}

// Gọi hàm loadPrinters khi tải trang
document.addEventListener("DOMContentLoaded", loadPrinters);