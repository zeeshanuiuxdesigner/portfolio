(function ($) {
  "use strict";

  const $window = $(window);
  /*----------------------------------
# header sticky 
-----------------------------------*/
  $.fn.elExists = function () {
    return this.length > 0;
  };


  const activeSticky = $("#sticky-header"),
    $winDow = $($window);
  $winDow.on("scroll", function () {
    const scroll = $($window).scrollTop(),
      isSticky = activeSticky;

    if (scroll < 1) {
      isSticky.removeClass("is-sticky");
    } else {
      isSticky.addClass("is-sticky");
    }
  });


  if ($(".brandCarousel").elExists()) {
    const brandCarousel = new Swiper(".brandCarousel .swiper", {
      pagination: false,
      spaceBetween: 30,
      loop: true,
      speed: 2000,
      autoplay: {
        delay: 2000,
      },
      breakpoints: {
        0: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
        1440: {
          slidesPerView: 7,
          spaceBetween: 130,
        },
      },
    });
  }



  if ($(".video-play-btn").elExists()) {
    $(".video-play-btn").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: true,
      fixedContentPos: true,
    });
  }




  if ($(".fact-counter-number").elExists()) {
    const counterUp = window.counterUp.default

    const callback = entries => {
      entries.forEach(entry => {
        const el = entry.target
        if (entry.isIntersecting && !el.classList.contains('is-visible')) {
          counterUp(el, {
            duration: 3000,
            delay: 15,
          })
          el.classList.add('is-visible')
        }
      })
    }

    const IO = new IntersectionObserver(callback, { threshold: 1 })

    const elements = document.querySelectorAll('.fact-counter-number');

    elements.forEach(function (el) {
      IO.observe(el)
    })


  }


 
  AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 100, // values from 0 to 3000, with step 50ms
    duration: 600, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

  });



  // Ajax Contact Form 

  if ($("#contact-form").elExists()) {

    const contactForm = $("#contact-form"),
      formMessages = $(".form-message");
    contactForm.validate({
      submitHandler: function (form) {
        $.ajax({
          type: "POST",
          url: form.action,
          data: $(form).serialize(),
        })
          .done(function (response) {
            console.log(response);
            formMessages
              .removeClass("error text-danger")
              .addClass("success text-success mt-3")
              .text(response);
            // Clear the form.
            form.reset();
          })
          .fail(function (data) {
            // Make sure that the formMessages div has the 'error' class.
            formMessages
              .removeClass("success text-success")
              .addClass("error text-danger mt-3");
            // Set the message text.

            console.log(data.responseText);

            if (data.responseText !== "") {
              formMessages.text(data.responseText);
            } else {
              formMessages.text(
                "Oops! An error occured and your message could not be sent."
              );
            }
          });
      },
    });
  }


  /*---------------------------------
        Scroll Up
    -----------------------------------*/
  function scrollToTop() {
    let $scrollUp = $("#scrollUp"),
      $lastScrollTop = 0,
      $window = $(window);

    $window.on("scroll", function () {
      const st = $(this).scrollTop();
      if (st > $lastScrollTop) {
        $scrollUp.css({ bottom: "-60px" });
      } else {
        if ($window.scrollTop() > 200) {
          $scrollUp.css({ bottom: "60px" });
        } else {
          $scrollUp.css({ bottom: "-60px" });
        }
      }
      $lastScrollTop = st;
    });

    $scrollUp.on("click", function (evt) {
      $("html, body").animate({ scrollTop: 0 }, 400);
      evt.preventDefault();
    });
  }
  scrollToTop();


  function radial_animate() {
    $('svg.radial-progress').each(function (index, value) {

      $(this).find($('circle.bar--animated')).removeAttr('style');
      // Get element in Veiw port
      const elementTop = $(this).offset().top;
      const elementBottom = elementTop + $(this).outerHeight();
      const viewportTop = $(window).scrollTop();
      const viewportBottom = viewportTop + $(window).height();

      if (elementBottom > viewportTop && elementTop < viewportBottom) {
        const percent = $(value).data('countervalue');
        const radius = $(this).find($('circle.bar--animated')).attr('r');
        const circumference = 2 * Math.PI * radius;
        const strokeDashOffset = circumference - ((percent * circumference) / 100);
        $(this).find($('circle.bar--animated')).animate({ 'stroke-dashoffset': strokeDashOffset }, 2800);
      }
    });
  }

  // To check If it is in Viewport 

  function check_if_in_view() {
    $('.countervalue').each(function () {
      if ($(this).hasClass('start')) {
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).outerHeight();

        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();

        if (elementBottom > viewportTop && elementTop < viewportBottom) {
          $(this).removeClass('start');
          $('.countervalue').text();
          let myNumbers = $(this).text();
          if (myNumbers == Math.floor(myNumbers)) {
            $(this).animate({
              Counter: $(this).text()
            }, {
              duration: 2800,
              easing: 'swing',
              step: function (now) {
                $(this).text(Math.ceil(now) + '%');
              }
            });
          } else {
            $(this).animate({
              Counter: $(this).text()
            }, {
              duration: 2800,
              easing: 'swing',
              step: function (now) {
                $(this).text(now.toFixed(2) + '$');
              }
            });
          }

          radial_animate();
        }
      }
    });
  }

  $window.on('scroll', check_if_in_view);
  $window.on('load', check_if_in_view);


})(jQuery);




