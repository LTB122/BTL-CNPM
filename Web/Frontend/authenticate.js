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

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Token không hợp lệ:', e);
        return null;
    }
}

function updateUIBasedOnLogin() {
    const token = localStorage.getItem('token');

    if (token) {
        const userInfo = parseJwt(token);
        if (userInfo.username === 'admin'){
            document.querySelector('.header__navbar-user').style.display = 'flex';
            document.querySelector('.header-item__print').style.display = 'none';
            document.querySelector('.header-item__login').style.display = 'none';
            document.querySelector('.header__navbar-user-menu').innerHTML = `
            <li class="header__navbar-user-item"><a href="../bao/danh_sach_may_in.html">Trang quản lý</a></li>
            <li class="header__navbar-user-item header__navbar-user-item--separate"><a href="#"> 
                <button id="button-logout">Đăng xuất</button></a></li>`;  
            document.querySelector('.header__navbar-user-menu').style.paddingBottom = '10px';

        } else {
            document.querySelector('.header__navbar-user').style.display = 'flex';
            document.querySelector('.header-item__print').style.display = 'flex';
            document.querySelector('.header-item__login').style.display = 'none';
            document.querySelector('.header__navbar-user-menu').innerHTML = `
            <li class="header__navbar-user-item"><a href="../info_user/info_user.html">Thông tin cá nhân</a></li>
            <li class="header__navbar-user-item"><a href="../binh/Print_History.html">Lịch sử in</a></li>
            <li class="header__navbar-user-item"><a href="../binh/bkpay.html">BKPay</a></li>
            <li class="header__navbar-user-item header__navbar-user-item--separate"><a href="#"> 
                <button id="button-logout">Đăng xuất</button></a></li>`;
        }

        // Gắn sự kiện cho nút đăng xuất sau khi phần tử đã được thêm vào DOM
        const logoutButton = document.querySelector('#button-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                localStorage.removeItem('token'); 
                updateUIBasedOnLogin(); 
                console.log('Đăng xuất thành công!');
            });
        } else {
            console.error('Không tìm thấy nút đăng xuất.');
        }

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

const logoutButton = document.querySelector('#button-logout');
if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('token'); 
        updateUIBasedOnLogin(); 
        console.log('Đăng xuất thành công!');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    updateUIBasedOnLogin();
});


