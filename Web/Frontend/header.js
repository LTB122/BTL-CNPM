const buyBtns = document.querySelectorAll('.header-item__login')
        // document de lay class trong bai query.. lay tat ca cac class co ten
        const modal = document.querySelector('.js-modal')
        const modalContai = document.querySelector('.js-modal-container')
        const tat=document.querySelector('.js-modal-close')

        function showbuyticket(){
            modal.classList.add('open')
        }

        function tatbuyticket(){
            modal.classList.remove('open')
        }

        for(const buyBtn of buyBtns){
            buyBtn.addEventListener('click', showbuyticket)
        } // chay tung nut trong buyBtns
        
        tat.addEventListener('click',tatbuyticket)
        modal.addEventListener('click',tatbuyticket)
        modalContai.addEventListener('click', function(event){
            event.stopPropagation()
        })// ngang chan click vao ben trong bi out ra