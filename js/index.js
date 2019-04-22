/**
 * SPLASHES 
 */

const SPLASH_ANIMATION_TIME = 1500;
const SPLASH_TIMEOUT = 8500;

const welcome = [
	"Только Вы и Ваш компьютер - никакой сложной техники и посредников. Все просто - нужно лишь начать",
	"Вам больше не нужны рекламщики и дизайнеры, попробуйте сами - все очень просто и бесплатно",
	"Один сервис - несколько компьютеров. Создайте аккаунт и сохраняйте свои работы на сервере автоматически. Это позволит Вам начать работу на одном комьютере и родолжить на другом",
	"Мы готовы воплотить в жизнь все Ваши идеи - наши ресурсы, Ваши идеи, Ваши изделия",
	"Проект родился в маленьком городе Пенза, но призван служить верным помощником большому миру"
];

var currentSplash = 0;
function showNextSplash() {
	if(++currentSplash > 5) {
		currentSplash = 1;
    };
	
    $("#splash-1").attr("src", "/img/splash/" + currentSplash + ".png");
    $("#welcome").fadeOut(SPLASH_ANIMATION_TIME / 2, function(){
		$("#welcome").html(welcome[currentSplash-1]);
		$("#welcome").fadeIn(SPLASH_ANIMATION_TIME / 2);
	});
    $("#splash-2").fadeOut(SPLASH_ANIMATION_TIME, function() {
    	$("#splash-2").attr("src", "/img/splash/" + currentSplash + ".png").css("display", "flex");
        setTimeout(showNextSplash, SPLASH_TIMEOUT);
    });
}

$(document).ready(function() {
    showNextSplash();
});

/**
 * ARROW UP/DOWN ANIMATION
 */
var currentArrowDirection = "down";
$(window).on("scroll", function() {
	var scroll = document.scrollingElement; 
	
	var animation = null, deg;
	if(scroll.scrollTop > scroll.scrollTopMax / 2) {
		if(currentArrowDirection == "down") {
			animation = "scroll-arrow-up-rotation";
			deg = 180;
			currentArrowDirection = "up";
		}
	} else {
		if(currentArrowDirection == "up") {
			animation = "scroll-arrow-down-rotation";
			deg = 0;
			currentArrowDirection = "down";
		}
	}
	
	if(animation != null) {
		$("#down").css("animation", animation + " 0.300s linear");
		setTimeout(function() {
			$("#down").css("transform", "rotate(" + deg + "deg)");
		}, 300);	
	}
});
