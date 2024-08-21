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

    tabs();
    timer();
    modal('[data-modal]', '.modal', modalTimeoutId);
    cards();
    forms(modalTimeoutId);
    slider();
    calc();
});