document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.getElementById("editButton");
    const modal = document.getElementById("editModal");
    const closeModalButton = document.getElementById("closeModal");

    // Hiển thị modal khi ấn nút chỉnh sửa
    editButton.addEventListener("click", function() {
        modal.style.display = "block";
    });

    // Tắt hiển thị modal khi ấn nút quay lại
    closeModalButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
});