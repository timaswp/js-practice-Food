document.addEventListener ("DOMContentLoaded", () => {
    const tabs = require('./modules/tabs.js'),
          timer = require('./modules/timer.js'),
          modal = require('./modules/modal.js'),
          cards = require('./modules/cards.js'),
          forms = require('./modules/forms.js'),
          slider = require('./modules/slider.js'),
          calc = require('./modules/calc.js');

    tabs();
    timer();
    modal();
    cards();
    forms();
    slider();
    calc();
});