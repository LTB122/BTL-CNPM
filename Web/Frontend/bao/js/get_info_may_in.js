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

try {
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
            const printerName = document.getElementById("printerName");            
            printerName.innerHTML = res[0].printerName;            

            const condition = document.getElementById("condition"); 
            let temp;
            if(res[0].condition === "Hoạt động") {
                temp = 
                `<div style="position: absolute; width: 214px; height: 67px; top: 79px; left: 468px; border-radius: 10px; background-color: #6AC76B; z-index: 1;">
                    <p style="text-align: center; font-weight: 700; font-size: 24px; color: white; position: relative; top: 15%;">
                        Đang hoạt động
                    </p>
                </div>`;
            } else {
                temp = 
                `<div style="position: absolute; width: 214px; height: 67px; top: 79px; left: 468px; border-radius: 10px; background-color: red; z-index: 1;">
                    <p style="text-align: center; font-weight: 700; font-size: 24px; color: white; position: relative; top: 15%;">
                        Đang bảo trì
                    </p>
                </div>`;
            }
            condition.innerHTML = temp;

            let ngay_san_xuat = document.getElementById("ngay_san_xuat");
            let date = new Date(res[0].dateOfProduct);
            let year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let day = String(date.getDate()).padStart(2, '0');
            ngay_san_xuat.innerHTML = `${day}/${month}/${year}`;

            const brand = document.getElementById("brand");            
            brand.innerHTML = res[0].brand;

            const company = document.getElementById("company");
            company.innerHTML = res[0].company;            

            const place = document.getElementById("place");
            console.log(res[0].place);
            place.innerHTML = res[0].place;            

            const systemInTime = document.getElementById("systemInTime");
            date = new Date(res[0].createdAt);
            if(isNaN(date) || date === "Invalid Date") {
                systemInTime.innerHTML = res[0].systemInTime;
            } else {
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                systemInTime.innerHTML = `${day}-${month}-${year}`;
            }            

            const printerCode = document.getElementById("printerCode");
            printerCode.innerHTML = res[0].printerCode;

            const allowedFileFormat = document.getElementById("allowedFileFormat");
            temp = `<div class="col col-5">
                <nobr style="color: #921A40; font-weight: 700; font-size: 20px;">
                    Định dạng file cho phép:
                </nobr>
            </div>`;
            for(let i = 0; i < res[0].allowedFileFormat.length; i ++) {
                if(res[0].allowedFileFormat[i].length < 3) continue;
                temp += `<div class="col col-3" id="${res[0].allowedFileFormat[i]}Appear">
                    <nobr style="font-weight: 600; font-size: 20px; color: #000000;">
                        <i class="fa fa-check" aria-hidden="true" style="color: green; border-radius: 90px; border: 1px solid green; padding: 4px; margin-right: 15px;"></i> 
                            
                        ${res[0].allowedFileFormat[i].toUpperCase()}
                    </nobr>
                </div>`;
            }
            
            allowedFileFormat.innerHTML = temp;
        });
    });    
} catch (error) {
    console.error("Error fetching printer profile:", error);
}