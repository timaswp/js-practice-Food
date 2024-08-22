function openModal(modalSelector, modalTimeoutId, showModalByScroll) {
    const modalWindow = document.querySelector(modalSelector);
    modalWindow.classList.remove('hide', 'fade-out');
    modalWindow.classList.add('show', 'fade-in');
    document.body.style.overflow = 'hidden';

    if (modalTimeoutId) {
        clearInterval(modalTimeoutId);
    }
    if (showModalByScroll) {
        window.removeEventListener('scroll', showModalByScroll);
    }
}

function closeModal(modalSelector) {
    const modalWindow = document.querySelector(modalSelector);
    modalWindow.classList.remove('show', 'fade-in');
    modalWindow.classList.add('fade-out');
    setTimeout(function() {
        modalWindow.classList.add('hide');
    }, 500);
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimeoutId) {

    //Modal window

    const modalOpen = document.querySelectorAll(triggerSelector),
          modalWindow = document.querySelector(modalSelector);
    
    modalOpen.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimeoutId, showModalByScroll));
    });

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimeoutId, showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {openModal, closeModal};