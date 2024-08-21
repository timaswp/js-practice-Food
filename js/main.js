import tabs from './modules/tabs';
import timer from './modules/timer';
import modal from './modules/modal';
import cards from './modules/cards';
import forms from './modules/forms';
import slider from './modules/slider';
import calc from './modules/calc';
import {openModal} from './modules/modal';

document.addEventListener ("DOMContentLoaded", () => {
    const modalTimeoutId = setTimeout(() => openModal('.modal', modalTimeoutId), 50000);

    tabs('.tabheader__item', '.tabheader__items', '.tabcontent', 'tabheader__item_active');
    timer('.timer', '2024-10-01');
    modal('[data-modal]', '.modal', modalTimeoutId);
    cards();
    forms('form', modalTimeoutId);
    slider({
        indicatorsContainer: '.carousel-indicators',
        slide: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        nextArrow: '.offer__slider-next',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
    calc();
});