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

document.getElementById('delete_may_in').addEventListener('submit', async (event) => {    
    try {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. Please log in first.");
            throw new Error("No token found. Please log in first.");
        }

        const currentURL = window.location.href;
        let url = new URL(currentURL);
        let search_params = url.searchParams;
        let ID = search_params.get('id');

        authenticatedFetch(
            `http://localhost:3000/api/printer/printerDeleted/${ID}`, {
                method: "DELETE"
            }
        ).then((response) => {
            console.log(response);
            if (!response.ok) {
                const errorData = response;
                console.error("Không thể xóa máy in: Máy in đã tồn tại trong hệ thống");
                alert(`Không thể xóa máy in: Máy in đã tồn tại trong hệ thống`);
                throw new Error("Failed to delete printer profile");
            } else {
                console.log("Xóa máy in thành công:");
                alert("Xóa máy in thành công!");
                location.replace("http://localhost:3000/bao/danh_sach_may_in.html");
            }
        });
    } catch (error) {
        console.error("Lỗi khi xóa máy in:", error);
        alert("Đã xảy ra lỗi khi xóa máy in.");
    }
});