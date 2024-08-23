function slider({indicatorsContainer, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {

    // slider

    const prev = document.querySelector(prevArrow),
          next = document.querySelector(nextArrow),
          totalSlideCount = document.querySelector(totalCounter),
          currentSlideCount = document.querySelector(currentCounter),
          sliderIndicator = document.querySelector(indicatorsContainer),
          slidesWrapper = document.querySelector(wrapper),
          slides = slidesWrapper.querySelectorAll(slide),
          slidesField = slidesWrapper.querySelector(field),
          slideWidth = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        slideOffset = 0,
        navDots = [];
    
    const hammer = new Hammer(slidesWrapper);

    hammer.on('swipeleft', () => {
        nextSlide();
    });

    hammer.on('swiperight', () => {
        prevSlide();
    });

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

    function nextSlide() {
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
    }

    function prevSlide() {
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
    }

    next.addEventListener('click', nextSlide);

    prev.addEventListener('click', prevSlide);

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

export default slider;