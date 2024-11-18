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

document.getElementById('post_may_in').addEventListener('submit', async (event) => {    
    try {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. Please log in first.");
            throw new Error("No token found. Please log in first.");
        }

        const updatedData = {
            printerCode: document.getElementById("printerCode").value,
            printerName: document.getElementById("printerName").value,
            dateProduct: document.getElementById("dateProduct").value,
            brand: document.getElementById("brand").value,
            company: document.getElementById("company").value,
            place: document.getElementById("place").value
        };

        console.log(document.getElementById("dateProduct").value);

        authenticatedFetch(
            `http://localhost:3000/api/printer/printerAdded`, {
                method: "POST",
                body: JSON.stringify(updatedData)
            }
        ).then((response) => {
            console.log(response);
            if (!response.ok) {
                const errorData = response;
                console.error("Không thể thêm máy in: Máy in đã tồn tại trong hệ thống");
                alert(`Không thể thêm máy in: Máy in đã tồn tại trong hệ thống`);
                throw new Error("Failed to fetch printer profile");
            } else {
                console.log("Thêm máy in thành công:");
                alert("Thêm máy in thành công!");
            }
        });
    } catch (error) {
        console.error("Lỗi khi thêm máy in:", error);
        alert("Đã xảy ra lỗi khi thêm máy in.");
    }
});