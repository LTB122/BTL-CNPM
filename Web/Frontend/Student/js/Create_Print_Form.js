const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
let uploadedFile = null; // Biến để track file đã upload
let totalPages = 0; // Biến lưu tổng số trang PDF

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

function filterPrintersByFileType(fileType) {
	const printerSelect = document.getElementById("printer");
	printerSelect.innerHTML = ""; // Xóa các lựa chọn hiện tại

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
			const filteredPrinters = printers.filter((printer) =>
				printer.allowedFileFormat.includes(fileType)
			);
			console.log(printers);
			if (filteredPrinters.length === 0) {
				const option = document.createElement("option");
				option.value = "";
				option.textContent = "Không có máy in hỗ trợ";
				printerSelect.appendChild(option);
			} else {
				filteredPrinters.forEach((printer) => {
					const option = document.createElement("option");
					option.value = printer.printerCode;
					option.textContent = printer.printerName;
					option.dataset.place = printer.place;
					printerSelect.appendChild(option);
				});
			}
		})
		.catch((error) => {
			console.error("Error loading printers:", error);
			alert("Không thể tải danh sách máy in. Vui lòng thử lại.");
		});
}

document
	.getElementById("fileElem")
	.addEventListener("change", async function (event) {
		const file = event.target.files[0];
		if (!file) return;

		// Lưu file vào biến uploadedFile
		uploadedFile = file;

		// Hiển thị tên file
		const fileNameElement = document.getElementById("file-name");
		fileNameElement.textContent = `${file.name}`;

		// Ẩn vùng upload và hiển thị khung preview
		const dropArea = document.getElementById("drop-area");
		const previewContainer = document.getElementById("file-preview");
		dropArea.style.display = "none";
		previewContainer.style.display = "flex";

		const filePreview = document.getElementById("file-preview");
		filePreview.innerHTML = ""; // Xóa nội dung cũ

		const fileType = file.type;
		const fileName = file.name;

		// Lấy định dạng file từ tên
		const fileTypeforPrinter = file.name.split(".").pop().toLowerCase();

		// Gọi hàm lọc máy in
		filterPrintersByFileType(fileTypeforPrinter);

		// Xử lý hiển thị preview
		if (fileType === "application/pdf") {
			// Xử lý file PDF
			const fileReader = new FileReader();
			fileReader.onload = async function () {
				const typedArray = new Uint8Array(this.result);

				const pdf = await pdfjsLib.getDocument(typedArray).promise;

				// Lấy tổng số trang PDF
				totalPages = pdf.numPages;

				// Render từng trang PDF
				for (
					let pageNumber = 1;
					pageNumber <= pdf.numPages;
					pageNumber++
				) {
					const page = await pdf.getPage(pageNumber);

					// Tạo canvas để render trang PDF
					const canvas = document.createElement("canvas");
					const context = canvas.getContext("2d");
					const viewport = page.getViewport({ scale: 1.5 });
					canvas.width = viewport.width;
					canvas.height = viewport.height;

					// Render trang PDF lên canvas
					await page.render({ canvasContext: context, viewport })
						.promise;

					// Thêm canvas vào preview
					previewContainer.appendChild(canvas);
				}
			};
			fileReader.readAsArrayBuffer(file);
		} else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
			const fileReader = new FileReader();
			fileReader.onload = async function () {
				const arrayBuffer = this.result;
				const result = await mammoth.extractRawText({ arrayBuffer });
				const wordContent = document.createElement("div");
				wordContent.textContent = result.value;
				previewContainer.appendChild(wordContent);

				// Ước tính số trang
				setTimeout(() => {
					const totalHeight = wordContent.offsetHeight;
					const containerHeight = 400; // Chiều cao cố định của khung
					const numPages = Math.ceil(totalHeight / containerHeight);
					totalPages = numPages;
				}, 0); // Chờ DOM render xong
			};
			fileReader.readAsArrayBuffer(file);
		} else if (fileType === "text/plain") {
			// Xử lý file văn bản TXT
			const fileReader = new FileReader();
			fileReader.onload = function () {
				const textContent = document.createElement("div");
				textContent.textContent = this.result;
				textContent.style.lineHeight = "1.5"; // Giả sử chiều cao mỗi dòng
				previewContainer.appendChild(textContent);

				// Tính số trang
				setTimeout(() => {
					const totalHeight = textContent.offsetHeight;
					const containerHeight = 400; // Chiều cao cố định của khung
					const numPages = Math.ceil(totalHeight / containerHeight);
					totalPages = numPages;
				}, 0); // Chờ DOM render xong
			};
			fileReader.readAsText(file);
		} else if (fileType === "text/html") {
			// HTML Preview
			const fileReader = new FileReader();
			fileReader.onload = function () {
				const htmlContent = this.result;

				// Tạo iframe để nhúng nội dung HTML
				const iframe = document.createElement("iframe");
				previewContainer.appendChild(iframe);
				const doc = iframe.contentWindow.document;

				// Ghi nội dung HTML vào trong iframe
				doc.open();
				doc.write(htmlContent);
				doc.close();

				// Tính số trang
				setTimeout(() => {
					const totalHeight = htmlContent.offsetHeight;
					const containerHeight = 400; // Chiều cao cố định của khung
					const numPages = Math.ceil(totalHeight / containerHeight);
					totalPages = numPages;
				}, 0); // Chờ DOM render xong
			};
			fileReader.readAsText(file);
		} else {
			// Nếu là loại file không được hỗ trợ
			filePreview.innerHTML = `<p>Không hỗ trợ định dạng file này.</p>`;
		}
	});

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
			printerSelect.innerHTML =
				"<option value=''>Không có máy in khả dụng</option>";
			alert("Không thể tải danh sách máy in. Vui lòng thử lại.");
		});
}

// Hàm lấy số trang hiện có
async function getCurrentPages() {
	return authenticatedFetch("http://localhost:3000/api/user/profile", {
		method: "GET",
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Không thể lấy số trang hiện có.");
			}
			return response.json();
		})
		.then((data) => {
			if (data.number_pager !== undefined) {
				return data.number_pager; // Trả về số trang hiện có
			} else {
				throw new Error("Dữ liệu không chứa thông tin số trang.");
			}
		})
		.catch((error) => {
			console.error("Lỗi khi lấy số trang:", error);
			return 0; // Mặc định trả về 0 nếu lỗi xảy ra
		});
}

// Hàm tính tổng số trang yêu cầu
function calculateRequiredPages(pages, copies, paperSize, side) {
	const sideMul = side === "1 mặt" ? 2 : 1;
	const pageMultiplier = paperSize === "A3" ? 2 : 1; // A3 tính là 2 trang A4
	return pages * copies * pageMultiplier * sideMul;
}

// Hàm kiểm tra số trang hiện có đủ không
function checkAvailablePages(currentPages, requiredPages) {
	if (currentPages < requiredPages) {
		alert("Số trang hiện không đủ. Vui lòng mua thêm trang.");
		return false;
	}
	return true;
}

// Hàm trừ số trang sau khi in thành công
async function updatePagesAfterPrint(usedPages) {
	// Lấy số trang hiện có từ API trước khi trừ
	getCurrentPages()
		.then((currentPages) => {
			const updatedPages = currentPages - usedPages;

			// Gửi yêu cầu cập nhật số trang mới lên server
			authenticatedFetch("http://localhost:3000/api/user/update-page", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ number_pager: updatedPages }),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							"Không thể cập nhật số trang sau khi in."
						);
					}
					return response.json();
				})
				.then(() => {
					alert("Số trang đã được cập nhật thành công!");
				})
				.catch((error) => {
					console.error("Lỗi khi cập nhật số trang:", error);
					alert("Không thể cập nhật số trang. Vui lòng thử lại.");
				});
		})
		.catch((error) => {
			console.error("Lỗi khi lấy số trang hiện có:", error);
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

	const pages = totalPages;
	const copies = Number(document.getElementById("copies").value);
	const paperSize = document.getElementById("paper-size").value;
	const side = document.getElementById("side").value;

	// Tính tổng số trang yêu cầu
	const requiredPages = calculateRequiredPages(
		pages,
		copies,
		paperSize,
		side
	);

	getCurrentPages().then((currentPages) => {
		if (!checkAvailablePages(currentPages, requiredPages)) {
			return; // Dừng nếu không đủ số trang
		}

		// Tiếp tục xử lý tạo đơn in nếu đủ số trang
		const orientation = document.querySelector(
			'input[name="orientation"]:checked'
		)?.value;
		const side = document.getElementById("side").value;
		const printer = document.getElementById("printer").value;
		const printerSelect = document.getElementById("printer");
		const selectedOption =
			printerSelect.options[printerSelect.selectedIndex];
		const printerName = selectedOption.textContent;
		const place = selectedOption.dataset.place;
		const fileName = document.getElementById("file-name").textContent;

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

		const updatedData = {
			paperSize: paperSize,
			orientation: orientation,
			pagesPrinted: Number(pages),
			copies: Number(copies),
			Display: side,
			fileName: fileName,
		};

		fetch(`http://localhost:3000/api/printLog/printRequest/${printer}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updatedData),
		})
			.then((response) => {
				if (response.ok) {
					const now = new Date();
					const formattedTime = formatDateTime(now);

					document.getElementById("modal-printer").textContent =
						printerName;
					document.getElementById("modal-pager").textContent =
						totalPages;
					document.getElementById("modal-place").textContent = place;
					document.getElementById("modal-time").textContent =
						formattedTime;
					document.getElementById("success-modal").style.display =
						"flex";

					// Trừ số trang sau khi in thành công
					updatePagesAfterPrint(requiredPages);
				} else {
					alert("Đã xảy ra lỗi khi tạo đơn in. Vui lòng thử lại.");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("Không thể kết nối tới máy chủ.");
			});
	});
}

function formatDateTime(date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}

// Tắt modal
function closeModal() {
	document.getElementById("success-modal").style.display = "none";
}

// Gọi hàm loadPrinters khi tải trang
document.addEventListener("DOMContentLoaded", loadPrinters);
