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

    const formData = new FormData();
    formData.append("paperSize", paperSize);
    formData.append("orientation", orientation);
    formData.append("pages", pages);
    formData.append("copies", copies);
    formData.append("side", side);
    formData.append("printer", printer);
    formData.append("file", uploadedFile);

    fetch("http://localhost:3000/", {
        method: "POST",
        body: formData,
    })
    .then((response) => {
        if (response.ok) {
            document.getElementById("modal-printer").textContent = printer;
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

// Tắt modal
function closeModal() {
    document.getElementById("success-modal").style.display = "none";
}