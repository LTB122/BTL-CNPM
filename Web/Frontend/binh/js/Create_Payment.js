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

document.getElementById('button-buy-pager').addEventListener('click', async () => {
    const soTo = document.getElementById('numberpage').value;

    if (!soTo || soTo <= 0) {
      alert('Vui lòng nhập số lượng tờ giấy hợp lệ!');
      return;
    }

    const data = {
      noiDung: "thêm giấy",
      soTo: parseInt(soTo, 10),
      daThanhToan: 0
    };

    try {
      const response = await authenticatedFetch('http://localhost:3000/api/payment/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi gửi đơn thanh toán. Vui lòng thử lại!');
    }
  });