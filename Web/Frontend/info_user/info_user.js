document.addEventListener('DOMContentLoaded', function() {
    const buyBtns = document.querySelectorAll('.item-buy-pager');
    const modal = document.querySelector('.js-modal-buy');
    const modalContainer = document.querySelector('.js-modal-container-buy');
    const closeBtn = document.querySelector('.js-modal-close-buy');
  
    function showbuyticket() {
      modal.classList.add('open');
    }
  
    function tatbuyticket() {
      modal.classList.remove('open');
    }
  
    // Attach click event to all buy buttons
    buyBtns.forEach(function(buyBtn) {
      buyBtn.addEventListener('click', showbuyticket);
    });
  
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', tatbuyticket);
  
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', tatbuyticket);
  
    // Prevent modal from closing when clicking inside the modal content
    modalContainer.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  });

  
  document.addEventListener('DOMContentLoaded', () => {
    // Chọn phần tử ảnh
    const imgElement = document.querySelector('.container-info-list__img');
    // Chọn phần tử upload container
    const uploadContainer = document.getElementById('upload-container');

    const xemlichsu = document.querySelector('.container-info-list__button-history');
    if (imgElement && uploadContainer) {
        // Thêm sự kiện click vào ảnh
        imgElement.addEventListener('click', () => {
            // Thay đổi thuộc tính display để hiển thị upload container
            uploadContainer.style.display = 'block';
            xemlichsu.style.display = 'none';
        });
    } else {
        console.error('Không tìm thấy phần tử ảnh hoặc upload container.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const imgElement = document.querySelector('.container-info-list__img');
  const uploadContainer = document.getElementById('upload-container');

  const xemlichsu = document.querySelector('.container-info-list__button-history');
  if (imgElement && uploadContainer) {
      // Hiển thị upload container khi nhấp vào ảnh
      imgElement.addEventListener('click', () => {
          uploadContainer.style.display = 'block';
          xemlichsu.style.display = 'none';
      });

      // Lắng nghe sự kiện click trên document để đóng upload container khi click ra ngoài
      document.addEventListener('click', (event) => {
          // Kiểm tra nếu click không phải vào upload container hoặc phần tử bên trong nó
          if (!uploadContainer.contains(event.target) && event.target !== imgElement) {
              uploadContainer.style.display = 'none';
              xemlichsu.style.display = 'block';
          }
      });
  } else {
      console.error('Không tìm thấy phần tử ảnh hoặc upload container.');
  }
});



// Xử lý sự kiện upload avatar

async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    // Đính kèm token vào header nếu token tồn tại
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
    
    // Thực hiện yêu cầu
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      console.error("Unauthorized: Token may be invalid or expired.");
    }
    
    return response;
  }
  
document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
      uploadForm.addEventListener('submit', async function (event) {
          event.preventDefault();

          const fileInput = document.getElementById('avatar');
          const file = fileInput.files[0];

          console.log(file);

          if (!file) {
              alert("Please select an image to upload.");
              return;
          }

          const formData = new FormData();
          formData.append('avatar', file);  // Thêm tệp vào formData

          const messageElement = document.getElementById('upload-message');
          messageElement.textContent = '';  // Reset lại thông báo trước đó

          try {
              const response = await authenticatedFetch('http://localhost:3000/api/user/upload-avatar', {
                  method: 'POST',
                  body: formData,
              });

              if (response.ok) {
                  const data = await response.json();
                  messageElement.textContent = 'Avatar uploaded successfully!';
                  messageElement.style.color = 'green';
                  console.log('User data:', data);
              } else {
                  const errorText = await response.text();
    
                  messageElement.textContent = `Error: ${errorText}`;
                  messageElement.style.color = 'red';
              }
          } catch (error) {
              messageElement.textContent = `Error: ${error.message}`;
              messageElement.style.color = 'red';
          }
      });
  } else {
      console.error('Không tìm thấy form #upload-form');
  }
});

