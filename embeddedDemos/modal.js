const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

//could we have LET openModalButtons and add the entities of our sensors (with their whole viewer source)?
openModalButtons.forEach(button =>{
    button.addEventListener('click', () =>{
        const modal = document.querySelector(button.dataset.modalTarget)
         openModal(modal)
    })

})

let modalButton = activateModal();
function myfunk(){
    if (modalButton === true){
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal)
    }
    console.log(modalButton)
}
myfunk

closeModalButtons.forEach(button =>{
    button.addEventListener('click', () =>{
        const modal = button.closest('.modal')
         closeModal(modal)
    })

})

function openModal(modal){
    if (modal==null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal){
    if (modal==null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}
