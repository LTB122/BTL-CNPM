// function parseJwt(token) {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split('')
//                 .map(function (c) {
//                     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//                 })
//                 .join('')
//         );
//         return JSON.parse(jsonPayload);
//     } catch (e) {
//         console.error('Token không hợp lệ:', e);
//         return null;
//     }
// }

// const token = localStorage.getItem('token');
// const userInfo = parseJwt(token);

// function getUserInfo(){
//     console.log(userInfo);
//     document.getElementById('name_user').value = userInfo.username;
// }

// getUserInfo();

// async function getUserProfile() {
//     try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             console.error('No token found. Please log in first.');
//             return;
//         }

//         // Fetch user profile data from the API
//         const response = await fetch('http://localhost:3000/api/user/profile', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}` 
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Failed to fetch user profile');
//         }

//         const userInfo = await response.json();

//         // Populate form fields with the retrieved user information
//         document.getElementById('name_user').value = userInfo.name || '';
//         document.getElementById('student_id').value = userInfo.mssv || '';
//         document.getElementById('phone').value = userInfo.sdt || '';
//         document.getElementById('email').value = userInfo.email || '';
//         document.getElementById('department').value = userInfo.department || '';
//         document.getElementById('number_pager').value = userInfo.number_pager || '';
//         document.getElementById('date').value = new Date(userInfo.date).toLocaleString() || '';
        
//         console.log('User profile loaded successfully.');
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//     }
// }