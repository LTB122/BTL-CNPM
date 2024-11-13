async function login(username, password) {
    // alert(`${username} ${password}`);
    try {
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token); // Lưu token vào localStorage
                updateUIBasedOnLogin();
                console.log('Đăng nhập thành công!');
            } else {
                console.error('Không nhận được token.');
                alert('Đăng nhập thất bại: Không nhận được token.');
            }
        } else {
            const errorData = await response.json();
            console.error('Đăng nhập thất bại:', errorData.message);
            alert(`Đăng nhập thất bại: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        // alert('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
}

async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        console.error("Không được phép: Token có thể không hợp lệ hoặc đã hết hạn.");
    }

    return response;
}

function updateUIBasedOnLogin() {
    const token = localStorage.getItem('token');

    if (token) {
        document.querySelector('.header__navbar-user').style.display = 'flex';
        document.querySelector('.header-item__print').style.display = 'flex';
        document.querySelector('.header-item__login').style.display = 'none';
    } else {
        document.querySelector('.header__navbar-user').style.display = 'none';
        document.querySelector('.header-item__print').style.display = 'none';
        document.querySelector('.header-item__login').style.display = 'block';
    }
}

document.querySelector('#button-login').addEventListener('click', async function () {
    const username = document.getElementById('username').value; 
    const password = document.getElementById('password').value;  
    // alert(`${username} ${password}`);
    await login(username, password);

    setTimeout(() => {
        const modal = document.querySelector('.js-modal');
        if (modal) {
            modal.classList.remove('open');
        }
    }, 200);
});

document.addEventListener('DOMContentLoaded', function () {
    updateUIBasedOnLogin();
});


