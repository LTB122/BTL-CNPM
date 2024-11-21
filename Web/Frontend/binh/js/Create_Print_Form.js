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
        document.querySelector(".file-label").textContent = file.name; // Hiển thị tên file
    }
}

function createOrder() {
    // Kiểm tra file đã upload chưa
    if (!uploadedFile) {
        alert("Vui lòng tải lên một file trước khi tạo đơn in.");
        return;
    }

    // Lưu các dữ liệu input
    const paperSize = document.getElementById("paper-size").value;
    const orientation = document.querySelector('input[name="orientation"]:checked')?.value;
    const pages = document.getElementById("pages").value;
    const copies = document.getElementById("copies").value;
    const side = document.getElementById("side").value;
    const printer = document.getElementById("printer").value;

    // Kiểm tra đã chọn hướng chưa
    if (!orientation) {
        alert("Vui lòng chọn hướng in (Hướng dọc hoặc Hướng ngang).");
        return;
    }

    // Xác nhận số trang có hợp lệ không
    if (!pages || pages < 1 || pages > 999) {
        alert("Vui lòng nhập số trang hợp lệ (từ 1 đến 999).");
        return;
    }

    // Xác nhận số lượng có hợp lệ không
    if (!copies || copies < 1 || copies > 999) {
        alert("Vui lòng nhập số lượng in hợp lệ (từ 1 đến 999).");
        return;
    }

    //Hiển thị modal sau khi ấn nút "Tạo đơn in" nếu tạo đơn in thành công
    document.getElementById("modal-printer").textContent = printer;
    document.getElementById("success-modal").style.display = "flex";

    //Chuẩn bị dữ liệu form để gửi về máy chủ
    const formData = {
        paperSize,
        orientation,
        pages,
        copies,
        side,
        printer,
        fileName: uploadedFile.name
    };
}

// Tắt modal
function closeModal() {
    document.getElementById("success-modal").style.display = "none";
}