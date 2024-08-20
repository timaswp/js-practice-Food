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