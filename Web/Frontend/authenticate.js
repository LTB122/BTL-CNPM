async function login(username, password) {
    try {
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token); // Save token to localStorage
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
        alert('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
}

async function dangky(name, username, password, email, mssv, sdt, department) {
    try {
        const response = await fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password, email, mssv, sdt, department })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Đăng ký thành công');
        } else {
            const errorData = await response.json();
            console.error('Đăng ký thất bại:', errorData.message);
            alert(`Đăng ký thất bại: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi trong quá trình đăng ký.');
    }
}

const dangkyButton = document.querySelector('#button-dangky');
if (dangkyButton) {
    dangkyButton.addEventListener('click', async function () {
        const fullName = document.getElementById('fullname').value;
        const usernamedangky = document.getElementById('usernamedangky').value;
        const passworddangky = document.getElementById('passworddangky').value;
        const emaildangky = document.getElementById('emaildangky').value;
        const mssvdangky = document.getElementById('mssvdangky').value;
        const sdtdangky = document.getElementById('sdtdangky').value;
        const khoadangky = document.getElementById('khoadangky').value;

        await dangky(fullName, usernamedangky, passworddangky, emaildangky, mssvdangky, sdtdangky, khoadangky);
        
        setTimeout(() => {
            const modal = document.querySelector('.js-modal-dangky');
            if (modal) {
                modal.classList.remove('open');
            }
        }, 200);
    });
}


async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token'); // Get token from localStorage

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
        if (userInfo && userInfo.username === 'admin') {
            document.querySelector('.header__navbar-user').style.display = 'flex';
            document.querySelector('.header-item__print').style.display = 'none';
            document.querySelector('.header-item__login').style.display = 'none';
            document.querySelector('.header-item__dangky').style.display = 'none';
            document.querySelector('.header__navbar-user-menu').innerHTML = `
                <li class="header__navbar-user-item"><a href="../bao/danh_sach_may_in.html">Trang quản lý</a></li>
                <li class="header__navbar-user-item header__navbar-user-item--separate"><a href="#"> 
                    <button id="button-logout">Đăng xuất</button></a></li>`;
            document.querySelector('.header__navbar-user-menu').style.paddingBottom = '10px';
        } else if (userInfo) {
            document.querySelector('.header__navbar-user').style.display = 'flex';
            document.querySelector('.header-item__print').style.display = 'flex';
            document.querySelector('.header-item__login').style.display = 'none';
            document.querySelector('.header-item__dangky').style.display = 'none';
            document.querySelector('.header__navbar-user-menu').innerHTML = `
                <li class="header__navbar-user-item"><a href="../info_user/info_user.html">Thông tin cá nhân</a></li>
                <li class="header__navbar-user-item"><a href="../binh/Print_History.html">Lịch sử in</a></li>
                <li class="header__navbar-user-item"><a href="../binh/bkpay.html">BKPay</a></li>
                <li class="header__navbar-user-item header__navbar-user-item--separate"><a href="#"> 
                    <button id="button-logout">Đăng xuất</button></a></li>`;
        }

        const logoutButton = document.querySelector('#button-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                localStorage.removeItem('token');
                updateUIBasedOnLogin();
                console.log('Đăng xuất thành công!');
                window.location.href = '../home/home_page.html';
            });
        } else {
            console.error('Không tìm thấy nút đăng xuất.');
        }

    } else {
        document.querySelector('.header__navbar-user').style.display = 'none';
        document.querySelector('.header-item__print').style.display = 'none';
        document.querySelector('.header-item__login').style.display = 'block';
        document.querySelector('.header-item__dangky').style.display = 'block';
    }
    getUserProfile();

    // try {
    //     const response =  authenticatedFetch('http://localhost:3000/api/user/profile', {
    //         method: 'GET',
    //     });
    //     const userInfo = response.json();

    //     userInfo.avatar = `/public${userInfo.avatar}`;
    //     document.querySelector('.header__navbar-user-img').src = `..${userInfo.avatar}`  || '../assets/img/Trieu_Man.jpg';
    // }catch (error) {
    //     console.error('Error fetching user profile:', error);
    // }

}

// Fetch and Populate User Profile
async function getUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found. Please log in first.');
            return;
        }

        const response = await authenticatedFetch('http://localhost:3000/api/user/profile', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const userInfo = await response.json();

        userInfo.avatar = `/public${userInfo.avatar}`;


        // Populate form fields with the retrieved user information
        const nameUser = document.getElementById('name_user');
        const studentId = document.getElementById('student_id');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const department = document.getElementById('department');
        const numberPager = document.getElementById('number_pager');
        const date = document.getElementById('date');
        const imgElement = document.querySelector('.container-info-list__img');
        const headerImgElement = document.querySelector('.header__navbar-user-img');

        if (nameUser) {
            document.getElementById('name_user').value = userInfo.name || '';
        }

        if (studentId) {
            document.getElementById('student_id').value = userInfo.mssv || '';
        }

        if (phone) {
            document.getElementById('phone').value = userInfo.sdt || '';
        }

        if (email) {
            document.getElementById('email').value = userInfo.email || '';
        }

        if (department) {
            document.getElementById('department').value = userInfo.department || '';
        }

        if (numberPager) {
            document.getElementById('number_pager').value = userInfo.number_pager || '';
        }

        if (date) {
            document.getElementById('date').value = userInfo.updatedAt ? new Date(userInfo.date).toLocaleString() : '';
        }

        if (imgElement) {
                    imgElement.src = `..${userInfo.avatar}` || '../assets/img/Trieu_Man.jpg';
        }

        if (headerImgElement) {
                    headerImgElement.src = `..${userInfo.avatar}` || '../assets/img/Trieu_Man.jpg';
        }

        console.log("HELLO");
        // const imgElement = document.querySelector('.container-info-list__img');
        // if (imgElement) {
        //     // Giả sử bạn có đối tượng userInfo chứa thông tin người dùng
        //     const avatarPath = userInfo && userInfo.avatar ? userInfo.avatar : '../assets/img/Trieu_Man.jpg';
        //     imgElement.src = avatarPath;
        // } else {
        // }

        // const imgElementheader = document.querySelector('.header__navbar-user-img');
        // if (imgElement) {
        //     // Giả sử bạn có đối tượng userInfo chứa thông tin người dùng
        //     const avatarPath = userInfo && userInfo.avatar ? userInfo.avatar : '../assets/img/Trieu_Man.jpg';
        //     imgElementheader.src = avatarPath;
        // } else {
        // }

        console.log('User profile loaded successfully.');
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Update User Profile
async function updateUserProfile(updatedData) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Không tìm thấy token. Vui lòng đăng nhập trước.');
        alert('Vui lòng đăng nhập để cập nhật hồ sơ.');
        return;
    }

    try {
        const response = await authenticatedFetch('http://localhost:3000/api/user/update-profile', {
            method: 'POST',
            body: JSON.stringify(updatedData) // Send only updated data
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Cập nhật thông tin người dùng thành công:', data);
            alert('Cập nhật hồ sơ thành công!');
        } else {
            const errorData = await response.json();
            console.error('Không thể cập nhật hồ sơ:', errorData.message);
            alert(`Không thể cập nhật hồ sơ: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error);
        alert('Đã xảy ra lỗi khi cập nhật hồ sơ.');
    }
}

// Update Number of Pages (Purchase)
async function updateNumberpage(updatedData) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Không tìm thấy token. Vui lòng đăng nhập trước.');
        alert('Vui lòng đăng nhập để mua thêm giấy.');
        return;
    }

    try {
        const response = await authenticatedFetch('http://localhost:3000/api/user/update-page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData) // Gửi dữ liệu đã cập nhật
        });

        if (response.ok) {
            const data = await response.json();
            alert('Mua thêm giấy thành công và vui lòng vào BKpay thanh toán!');

            document.getElementById('number_pager').value = data.number_pager || updatedData.number_pager;

            const displayPager = document.querySelector('.display-number-pager');
            if (displayPager) {
                displayPager.textContent = `Số lượng giấy hiện tại: ${data.number_pager || updatedData.number_pager}`;
            }

        } else {
            const errorData = await response.json();
            alert(`Không thể mua thêm: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Lỗi khi mua thêm giấy:', error);
        alert('Đã xảy ra lỗi khi mua thêm giấy.');
    }
}





// Event Listener Setup on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    
    updateUIBasedOnLogin();
    getUserProfile();

    // Login Button
    const loginButton = document.querySelector('#button-login');
    if (loginButton) {
        loginButton.addEventListener('click', async function () {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            await login(username, password);

            setTimeout(() => {
                const modal = document.querySelector('.js-modal');
                if (modal) {
                    modal.classList.remove('open');
                }
            }, 200);
        });
    }

    //nut dang ky
    // const dangkyButton = document.querySelector('#button-dangky');
    // if (loginButton) {
    //     loginButton.addEventListener('click', async function () {
    //         const fullName = document.getElementById('fullname').value;
    //         const usernamedangky = document.getElementById('usernamedangky').value;
    //         const passworddangky = document.getElementById('passworddangky').value;
    //         const emaildangky = document.getElementById('emaildangky').value;
    //         const mssvdangky = document.getElementById('mssvdangky').value;
    //         const sdtdangky = document.getElementById('sdtdangky').value;
    //         const khoadangky = document.getElementById('khoadangky').value;

    //         await dangky(fullName, usernamedangky, passworddangky, emaildangky, mssvdangky, sdtdangky, khoadangky);
            
    //         setTimeout(() => {
    //             const modal = document.querySelector('.js-modal-dangky');
    //             if (modal) {
    //                 modal.classList.remove('open');
    //             }
    //         }, 200);
    //     });
    // }
    // Logout Button
    const logoutButton = document.querySelector('#button-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('token');
            updateUIBasedOnLogin();
            console.log('Đăng xuất thành công!');
            window.location.href = '../home/home_page.html';
        });
    }

    // Update Profile Button
    const updateProfileButton = document.querySelector('.button-update-info');
    if (updateProfileButton) {
        updateProfileButton.addEventListener('click', async (event) => {
            event.preventDefault();

            const updatedData = {
                name: document.getElementById('name_user').value,
                sdt: document.getElementById('phone').value,
                email: document.getElementById('email').value,
            };

            // Gửi yêu cầu cập nhật
            await updateUserProfile(updatedData);
        });
    } else {
        console.error('Không tìm thấy nút cập nhật thông tin.');
    }

    // Buy Page Button
    const buyButton = document.querySelector('#button-buy-pager');
    if (buyButton) {
        buyButton.addEventListener('click', async (event) => {
            event.preventDefault();

            const numberPageInput = document.getElementById('numberpage'); // Correct ID
            if (!numberPageInput) {
                console.error('Không tìm thấy trường nhập số lượng giấy.');
                alert('Vui lòng nhập số lượng giấy cần mua.');
                return;
            }

            const numberPagerValue = parseInt(numberPageInput.value);
            if (isNaN(numberPagerValue) || numberPagerValue <= 0) {
                alert('Vui lòng nhập số lượng giấy hợp lệ.');
                return;
            }
            const response = await authenticatedFetch('http://localhost:3000/api/user/profile', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const userInfo = await response.json();
            const currentNumberPager = parseInt(userInfo.number_pager);
            const temp = numberPagerValue + currentNumberPager;
            const updatedData = {
                number_pager: temp
            };

            // Gửi yêu cầu mua thêm giấy
            await updateNumberpage(updatedData);
        });
    } else {
        console.error('Không tìm thấy nút mua giấy (#button-buy-pager).');
    }
});
