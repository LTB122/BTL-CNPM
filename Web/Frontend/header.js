
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
        } 
        
        tat.addEventListener('click',tatbuyticket)
        modal.addEventListener('click',tatbuyticket)
        modalContai.addEventListener('click', function(event){
            event.stopPropagation()
        })

//////////////////////////////////////////////////////////////////////

    
    // document.querySelector('#button-login').addEventListener('click', function(){
    //     const username = document.getElementById('howmany').value;
    //     const password = document.getElementById('email1').value;
    
    //     const courseApiHeader = 'http://localhost:3000/api/user/login';

    //     const response = fetch(courseApiHeader, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             username: username,
    //             password: password,
    //         }),
    //     });

    //     if (response.ok) {
    //         // trạng thái HTTP nằm trong khoảng 200-299
    //         console.log('Login successful');
        
    //         setTimeout(() => {
    //             tatbuyticket();
    //         }, 2000);
    //     } else {
    //         console.log('Login failed');
    //     }
    // });
    



    const buyBtnsDangky = document.querySelectorAll('.header-item__dangky ')

    const modalDangky = document.querySelector('.js-modal-dangky')
    const modalDangkyContai = document.querySelector('.js-modal-container-dangky')
    const tatDangky=document.querySelector('.js-modal-close-dangky')

    function showbuyticketDangky(){
        modalDangky.classList.add('open')
    }

    function tatDangkybuyticket(){
        modalDangky.classList.remove('open')
    }

    for(const buyBtn of buyBtnsDangky){
        buyBtn.addEventListener('click', showbuyticketDangky)
    } 
    
    tatDangky.addEventListener('click',tatDangkybuyticket)
    modalDangky.addEventListener('click',tatDangkybuyticket)
    modalDangkyContai.addEventListener('click', function(event){
        event.stopPropagation()
    })