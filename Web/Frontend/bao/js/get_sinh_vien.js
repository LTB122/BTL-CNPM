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
        "http://localhost:3000/api/user/get-users", {
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
            const danh_sach_sinh_vien = document.getElementById("danh_sach_sinh_vien");
            let htmls = "";            

            for(let i = 0; i < res.length; i ++) {
                let template = 
                `<div class="shadow" style="height: 120px; width: 100%; border: 1px solid black; border-radius: 15px; background-color: #FFFFFF; margin-bottom: 20px; display: flex; flex-wrap: wrap; justify-content: center;">
                    <div style="width: 12%; background-color: transparent; height: 100%; padding: 10px;">
                        <img src="../assets/img/Trieu_Man.jpg" width="99" height="99" style="border: 0.4 solid black; border-radius: 5px;" alt="">
                    </div>                    

                    <div style="width: 70%; height: 100%; background-color: transparent; padding-left: 40px; display: flex; flex-wrap: wrap; align-content: space-around; padding-top: 5px; padding-bottom: 5px;">
                        <p style="font-size: 14px; color: black; width: 100%;">
                            <nobr style="color: #921A40; font-weight: bold;">
                                Họ và tên:
                            </nobr> 
                            
                            <nobr id="name">
                                ${res[i].name}
                            </nobr>                                
                        </p>

                        <p style="font-size: 14px; color: black; width: 100%;">
                            <nobr style="color: #921A40; font-weight: bold;">
                                MSSV:
                            </nobr> 
                            
                            <nobr id="MSSV">
                                ${res[i].mssv}
                            </nobr>                                
                        </p>

                        <p style="font-size: 14px; color: black; width: 100%;">
                            <nobr style="color: #921A40; font-weight: bold;">
                                Khoa:
                            </nobr> 
                            
                            <nobr id="faculty">
                                ${res[i].department}
                            </nobr>                                
                        </p>
                    </div>
                    
                    <div style="width: 18%; background-color: transparent; display: flex; flex-flow: column-reverse wrap;">
                        <div style="border-radius: 10px; height: 42px; background-color: #F581A2; width: 90%; justify-items: center; margin-bottom: 12px;">
                            <p type="button" style="font-size: 18px; width: 125px; height: 24px;" class="text-white btn">
                                Truy cập
                            </p>
                        </div>
                    </div>                        
                </div>`;
                htmls += template;
            }
            danh_sach_sinh_vien.innerHTML = htmls;
        });        
    });    
} catch (error) {
    console.error("Error fetching printer profile:", error);
}