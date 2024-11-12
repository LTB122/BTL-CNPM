async function login(username, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Lưu token vào localStorage
            console.log('Logged in successfully!');
        } else {
            console.error('Login failed.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    
    // Đính kèm token vào header nếu token tồn tại
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    
    // Thực hiện yêu cầu
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
        console.error("Unauthorized: Token may be invalid or expired.");
        // Xử lý khi token hết hạn hoặc không hợp lệ ở đây
    }
    
    return response;
}
