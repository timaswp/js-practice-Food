import {openModal, closeModal} from './modal';

function forms(modalTimeoutId) {

    //Forms

    const forms = document.querySelectorAll('form'),
          prevModalDialog = document.querySelector('.modal__dialog');

    const messages = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    };
    
    forms.forEach(item => {
        submitForm(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: data
        });

        return await res.json();
    };

    function submitForm(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = messages.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(messages.success);
            })
            .catch(() => {
                showThanksModal(messages.failure);
            })
            .finally(() => {
                form.reset();
                statusMessage.remove();
            })
        });
    }

    function showThanksModal(message) {
        prevModalDialog.classList.toggle('hide');
        openModal('.modal', modalTimeoutId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modalWindow.append(thanksModal);

        setTimeout(() => {
            closeModal('.modal');
            thanksModal.remove();
            setTimeout(() => prevModalDialog.classList.toggle('hide'), 1000);
        }, 4000);
    }
}

export default forms;