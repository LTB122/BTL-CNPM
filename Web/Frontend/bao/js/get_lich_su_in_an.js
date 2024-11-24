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

    authenticatedFetch(
        `http://localhost:3000/api/printLog/getPrintHistory/admin`, {
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
            let htmls = "";            
            for(let i = 0; i < res.length; i ++) {
                const date = new Date(res[0].createdAt);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                let temp = 
                `<div class="shadow" style="height: 120px; width: 100%; border: 1px solid black; border-radius: 15px; background-color: #FFFFFF; margin-bottom: 20px;">
                    <div style="width: 40%; height: 120px; background-color: transparent; float: left; display: flex; flex-flow: column wrap; justify-content: space-around; padding: 12px;">
                        <div style="height: 32px; width: 350px; background-color: transparent;">
                            <p style="color: black;">
                                <nobr style="color: #921A40; font-weight: bold; font-size: 14px;">
                                    Mã đơn in:
                                </nobr> 
                                
                                <nobr id="ma_don_in">
                                    ${res[i]._id}
                                </nobr>                                
                            </p>
                        </div>

                        <div style="height: 32px; width: 350px; background-color: transparent;">                            
                            <p style="color: black;">
                                <nobr style="color: #921A40; font-weight: bold; font-size: 14px;">
                                    Mã máy in:
                                </nobr> 
                                                                
                                <nobr id="ma_may_in">
                                    ${res[i].printerCode}
                                </nobr>
                            </p>
                        </div>

                        <div style="height: 32px; width: 350px; background-color: transparent;">                            
                            <p style="color: black;">
                                <nobr style="color: #921A40; font-weight: bold; font-size: 14px;">
                                    Tài khoản thực hiện:
                                </nobr> 
                                                                
                                <nobr id="tai_khoan_thuc_hien">
                                    ${res[i].userName}
                                </nobr>
                            </p>
                        </div>
                    </div>

                    <div style="width: 30%; height: 121px; background-color: transparent; float: left; display: flex; flex-flow: column wrap; justify-content: flex-start; padding: 12px;">
                        <div style="height: 32px; width: 350px; background-color: transparent;">                            
                            <p style="color: black;">
                                <nobr style="color: #921A40; font-weight: bold; font-size: 14px;">
                                    Thời gian:
                                </nobr> 
                                                                
                                <nobr id="thoi_gian">
                                    ${hours}:${minutes}:${seconds}
                                </nobr>
                            </p>
                        </div>

                        <div style="height: 32px; width: 350px; background-color: transparent;">                            
                            <p style="color: black;">
                                <nobr style="color: #921A40; font-weight: bold; font-size: 14px;">
                                    Ngày in:
                                </nobr> 
                                                                
                                <nobr id="ngay_in">
                                    ${day}-${month}-${year}
                                </nobr>
                            </p>
                        </div>
                    </div>

                    <div style="width: 30%; height: 100%; display: flex; flex-flow: row-reverse wrap; justify-content: flex-start; align-items: flex-end;">
                        <p type="button" style="font-size: 18px; width: 125px; border-radius: 10px; background-color: #F581A2; margin-right: 15px;" class="text-white btn">
                            Xem chi tiết
                        </p>
                    </div>
                </div>`;

                htmls += temp;
            }

            const lich_su_in_an = document.getElementById("lich_su_in_an");
            lich_su_in_an.innerHTML = htmls;
        });
    });    
} catch (error) {
    console.error("Error fetching printer profile:", error);
}