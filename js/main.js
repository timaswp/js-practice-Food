"use strict";

document.addEventListener ("DOMContentLoaded", () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsParent = document.querySelector('.tabheader__items'),
          tabsContent = document.querySelectorAll('.tabcontent');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.remove('show', 'fade-in');
            item.classList.add('hide');
        });
        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade-in');
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener ("click", (e) => {
        const target = e.target;

        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    const deadline = '2024-08-23';

    function getRemainedTime(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              mins = Math.floor((t / (1000 * 60)) % 60),
              secs = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': mins,
            'seconds': secs
        };
    }

    function addZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setTimer(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              mins = timer.querySelector('#minutes'),
              secs = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateTimer, 1000);

        updateTimer();

        function updateTimer() {
            const t = getRemainedTime(endtime);

            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            mins.innerHTML = addZero(t.minutes);
            secs.innerHTML = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setTimer('.timer', deadline);

    //Modal window

    const modalOpen = document.querySelectorAll('[data-modal]'),
          modalWindow = document.querySelector('.modal'),
          prevModalDialog = document.querySelector('.modal__dialog');

    function openModal() {
        modalWindow.classList.remove('hide', 'fade-out');
        modalWindow.classList.add('show', 'fade-in');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimeoutId);
        window.removeEventListener('scroll', showModalByScroll);
    }
    
    modalOpen.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
            modalWindow.classList.remove('show', 'fade-in');
            modalWindow.classList.add('fade-out');
            setTimeout(function() {
                modalWindow.classList.add('hide');
            }, 500);
            document.body.style.overflow = '';
    }

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimeoutId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //Classes for cards

    class MenuCard {
        constructor (img, alt, title, text, price, parentSelector, ...classes) {
            this.img = img;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 41;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.img} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // without axios:

    // const getResource = async (url) => {
    //     const res = await fetch(url)

    //     if (!res.ok) {
    //        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    //     }

    //     return await res.json(); 
    // };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, alt, title, text, price}) => {
    //             new MenuCard(img, alt, title, text, price, '.menu .container').render(); 
    //         });
    //     });

    //with axios

    axios.get('http://localhost:3000/menu')
        .then(response => {
            response.data.forEach(({img, alt, title, text, price}) => {
            new MenuCard(img, alt, title, text, price, '.menu .container').render(); 
            });
        });

    //Forms

    const forms = document.querySelectorAll('form');

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
        openModal();

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
            closeModal();
            thanksModal.remove();
            setTimeout(() => prevModalDialog.classList.toggle('hide'), 1000);
        }, 4000);
    }

    // slider

    const prevArrow = document.querySelector('.offer__slider-prev'),
          nextArrow = document.querySelector('.offer__slider-next'),
          totalSlideCount = document.querySelector('#total'),
          currentSlideCount = document.querySelector('#current'),
          sliderIndicator = document.querySelector('.carousel-indicators'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slides = slidesWrapper.querySelectorAll('.offer__slide'),
          slidesField = slidesWrapper.querySelector('.offer__slider-inner'),
          slideWidth = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        slideOffset = 0,
        navDots = [];

    const countSlide = function() {
        if (slides.length < 10) {
            currentSlideCount.textContent = `0${slideIndex}`;
        } else {
            currentSlideCount.textContent = slideIndex;
        }
    };

    const toggleSlideDot = function(n) {
        navDots.forEach(dot => dot.classList.remove('dot_active'));
        navDots[n].classList.add('dot_active');
    };

    if (slides.length < 10) {
        totalSlideCount.textContent = `0${slides.length}`;
        currentSlideCount.textContent = `0${slideIndex}`;
    } else {
        totalSlideCount.textContent = slides.length;
        currentSlideCount.textContent = slideIndex;
    }

    for (let i = 0; i < slides.length; i++) {
        const navDot = document.createElement('li');
        if (i == 0) {
            navDot.classList.add('dot', 'dot_active')
        } else {
            navDot.classList.add('dot');
        }
        sliderIndicator.append(navDot);
        navDots.push(navDot);
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = "flex";
    slidesField.style.transition = ".5s all";

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = slideWidth;
    });

    nextArrow.addEventListener('click', () => {
        if (slideOffset == +slideWidth.slice(0, slideWidth.length - 2) * (slides.length - 1)) {
            slideOffset = 0;
        } else {
            slideOffset += +slideWidth.slice(0, slideWidth.length - 2);
        }

        slidesField.style.transform = `translateX(-${slideOffset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        countSlide();
        toggleSlideDot(slideIndex-1);
    });

    prevArrow.addEventListener('click', () => {
        if (slideOffset == 0) {
            slideOffset = +slideWidth.slice(0, slideWidth.length - 2) * (slides.length - 1);
        } else {
            slideOffset -= +slideWidth.slice(0, slideWidth.length - 2);
        }

        slidesField.style.transform = `translateX(-${slideOffset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        
        countSlide();
        toggleSlideDot(slideIndex-1);
    });

    navDots.forEach((dot, i) => {
        dot.addEventListener('click', function() {
            slideIndex = i + 1;
            
            countSlide();
            toggleSlideDot(i);

            slideOffset = +slideWidth.slice(0, slideWidth.length - 2) * i;
            slidesField.style.transform = `translateX(-${slideOffset}px)`;

        });
    });
});