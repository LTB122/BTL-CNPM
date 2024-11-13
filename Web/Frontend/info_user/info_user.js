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

  
  