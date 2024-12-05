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

    authenticatedFetch(
        "http://localhost:3000/api/printer/printer", {
            method: "GET",
        }
    ).then((response) => {
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to fetch printer profile");
        }
    
        const printerInfo = response.json();
        console.log("printer profile loaded successfully.");
        console.log("JSON", printerInfo);

        printerInfo.then((res) => {
            const danh_sach_may_in = document.getElementById("danh_sach_may_in");
            let htmls = "";            

            for(let i = 0; i < res.length; i ++) {
                let colors = res[i].condition;
                if(colors === "Hoạt động") {
                    colors = '#6AC76B';
                } else {
                    colors = '#FA3636';
                }
                let template = 
                `<a href="./thong_tin_may_in.html?id=${res[i]._id}" style="background-color: #FFEBEB;">
                    <li type="button" style="display: flex; flex-wrap: wrap; width: 267px; height: 318px;">
                        <img src="../assets/img/printer_ok.png" style="width: 267px; height: 206px; border: 1px solid black;">
                        <div style="width: 100%; height: 44px; justify-content: center; background-color: transparent;">
                            <p style="text-align: center; font-size: 14px; font-weight: 400; line-height: 18.2px; color: #000000;">
                                ${res[i].printerName}
                            </p>
                        </div>
                        <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: flex-end;">
                            <div style="background-color: ${colors}; width: 158px; height: 26px; border-radius: 10px; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; margin-right: 15px;">
                                <p style="font-size: 16px; font-weight: 700; line-height: 19.36px; text-align: center; top: 3px; color: #FFFFFF;">
                                    ${res[i].condition}
                                </p>
                            </div>
                        </div>
                    </li>
                </a>`;
                htmls += template;
            }
            danh_sach_may_in.innerHTML = htmls;
        });        
    });    
} catch (error) {
    console.error("Error fetching printer profile:", error);
}