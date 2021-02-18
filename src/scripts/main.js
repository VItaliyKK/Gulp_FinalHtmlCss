$(document).ready(styleHeader)

$(window).on("resize", styleHeader)

$(window).on("scroll", styleHeader)

// ** gradual background display ** 
function styleHeader(){
	$('.header_wrapper').css({
        backgroundColor: `rgba(255 78 80 / ${
        	window.scrollY <= 360 ? window.scrollY/4 : 90
        }%)`
    })
}; 