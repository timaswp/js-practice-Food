/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {

    //Calculator

    const calcResult = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio = 1.375;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            calcResult.textContent = '___ ';
            return;
        }

        if (sex === 'female') {
            calcResult.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            calcResult.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcTotal();

    function getStaticInfo(selector, activeClass) {
        const elements = document.querySelectorAll(`${selector}`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
        
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = "1px solid #54ed39";
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {

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
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {

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
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {

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
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {

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

    function countSlide() {
        if (slides.length < 10) {
            currentSlideCount.textContent = `0${slideIndex}`;
        } else {
            currentSlideCount.textContent = slideIndex;
        }
    }

    function toggleSlideDot(n) {
        navDots.forEach(dot => dot.classList.remove('dot_active'));
        navDots[n].classList.add('dot_active');
    }

    function digitalize(str) {
        return +str.replace(/\D/g, '');
    }

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
        if (slideOffset == digitalize(slideWidth) * (slides.length - 1)) {
            slideOffset = 0;
        } else {
            slideOffset += digitalize(slideWidth);
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
            slideOffset = digitalize(slideWidth) * (slides.length - 1);
        } else {
            slideOffset -= digitalize(slideWidth);
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

            slideOffset = digitalize(slideWidth) * i;
            slidesField.style.transform = `translateX(-${slideOffset}px)`;

        });
    });
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
    
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
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {

    //Timer

    const deadline = '2024-10-01';

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
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
document.addEventListener ("DOMContentLoaded", () => {
    const tabs = __webpack_require__(/*! ./modules/tabs.js */ "./js/modules/tabs.js"),
          timer = __webpack_require__(/*! ./modules/timer.js */ "./js/modules/timer.js"),
          modal = __webpack_require__(/*! ./modules/modal.js */ "./js/modules/modal.js"),
          cards = __webpack_require__(/*! ./modules/cards.js */ "./js/modules/cards.js"),
          forms = __webpack_require__(/*! ./modules/forms.js */ "./js/modules/forms.js"),
          slider = __webpack_require__(/*! ./modules/slider.js */ "./js/modules/slider.js"),
          calc = __webpack_require__(/*! ./modules/calc.js */ "./js/modules/calc.js");

    tabs();
    timer();
    modal();
    cards();
    forms();
    slider();
    calc();
});
/******/ })()
;
//# sourceMappingURL=bundle.js.map