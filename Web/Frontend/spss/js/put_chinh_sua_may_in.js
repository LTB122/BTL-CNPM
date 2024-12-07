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

const currentURL = window.location.href;
let url = new URL(currentURL);
let search_params = url.searchParams;
let ID = search_params.get('id');

authenticatedFetch(
    `http://localhost:3000/api/printer/printer/${ID}`, {
        method: "GET",
    }
).then((response) => {
    console.log(response);
    if (!response.ok) {
        throw new Error("Failed to fetch printer profile");
    }

    const printerInfo = response.json();
    console.log("printer profile loaded successfully.");
    console.log("JSON", response);

    printerInfo.then((res) => {
        if(res[0].condition === "Hoạt động") {
            const active = document.getElementById("active");
            active.checked = true;
        } else {
            const maintenance = document.getElementById("maintenance");
            maintenance.checked = true;
        }

        let ngay_san_xuat = document.getElementById("date-manufactured");
        date = new Date(res[0].dateOfProduct);
        if(isNaN(date) || date === "Invalid Date") {
            ngay_san_xuat.value = res[0].systemInTime;
        } else {
            year = date.getFullYear();
            month = String(date.getMonth() + 1).padStart(2, '0');
            day = String(date.getDate()).padStart(2, '0');
            ngay_san_xuat.value = `${day}/${month}/${year}`;
        }

        const brand = document.getElementById("device-model");            
        brand.value = res[0].brand;

        const company = document.getElementById("manufacturer");
        company.value = res[0].company;

        const place = document.getElementById("location");
        place.value = res[0].place;            

        const systemInTime = document.getElementById("use-date");
        date = new Date(res[0].createdAt);
        if(isNaN(date) || date === "Invalid Date") {
            systemInTime.value = res[0].systemInTime;
        } else {
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            systemInTime.value = `${day}-${month}-${year}`;
        }           

        const printerCode = document.getElementById("printer-id");
        printerCode.value = res[0].printerCode;

        for(let i = 0; i < res[0].allowedFileFormat.length; i ++) {
            if(res[0].allowedFileFormat[i].length <= 0) continue;
            let value = res[0].allowedFileFormat[i];
            const temp = document.getElementById(`${value}`);
            temp.checked = true;
        }
    });
});

document.getElementById('chinh_sua_may_in').addEventListener('submit', async (event) => {    
    try {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. Please log in first.");
            throw new Error("No token found. Please log in first.");
        }

        let allowedFileFormatList = [];
        document.getElementById("doc").checked ? allowedFileFormatList.push("doc") : null;
        document.getElementById("docx").checked ? allowedFileFormatList.push("docx") : null;
        document.getElementById("pdf").checked ? allowedFileFormatList.push("pdf") : null;
        document.getElementById("odt").checked ? allowedFileFormatList.push("odt") : null;
        document.getElementById("txt").checked ? allowedFileFormatList.push("txt") : null;
        document.getElementById("html").checked ? allowedFileFormatList.push("html") : null;

        let conditionVal = document.querySelector('input[name="status"]:checked').value;

        const updatedData = {
            dateOfProduct: document.getElementById("date-manufactured").value,
            condition: conditionVal === "active" ? "Hoạt động" : "Đang bảo trì",
            brand: document.getElementById("device-model").value,
            company: document.getElementById("manufacturer").value,
            place: document.getElementById("location").value,
            place: document.getElementById("location").value,
            systemInTime: document.getElementById("use-date").value,
            allowedFileFormat: allowedFileFormatList
        };

        authenticatedFetch(
            `http://localhost:3000/api/printer/printerFixed/${ID}`, {
                method: "PUT",
                body: JSON.stringify(updatedData)
            }
        ).then((response) => {
            console.log(response);
            if (!response.ok) {
                const errorData = response;
                console.error("Không thể chỉnh sửa máy in: Máy in đã tồn tại trong hệ thống");
                alert(`Không thể chỉnh sửa máy in: Máy in đã tồn tại trong hệ thống`);
                throw new Error("Failed to fetch printer profile");
            } else {
                console.log("Chỉnh sửa máy in thành công:");
                alert("Chỉnh sửa máy in thành công!");
                location.replace("http://localhost:3000/spss/danh_sach_may_in.html");
            }
        });
    } catch (error) {
        console.error("Lỗi khi xóa máy in:", error);
        alert("Đã xảy ra lỗi khi xóa máy in.");
    }
});