$(document).ready(function () {
    $('.slider-img').slick({
        arrows: true,
        dots: false,
        infinite: true,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2500,
        prevArrow: $('.slider-arrow-left'),
        nextArrow: $('.slider-arrow-right'),
        fade: true,
    });
});