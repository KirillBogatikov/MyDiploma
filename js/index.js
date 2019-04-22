/**
 * SPLASHES 
 */

const SPLASH_ANIMATION_TIME = 1500;
const SPLASH_TIMEOUT = 3500;

const welcome = [
	"Только Вы и Ваш компьютер - никакой сложной техники и посредников. Все просто - нужно лишь начать",
	"Вам больше не нужны рекламщики и дизайнеры, попробуйте сами - все очень просто и бесплатно",
	"Один сервис - несколько комьютеров. Создайте аккаунт и сохраняйте свои работы на сервере автоматически. Это позволит Вам начать работу на одном комьютере и родолжить на другом",
	"Мы готовы волотить в жизнь все Ваши идеи - наши ресурсы, Ваши идеи, Ваши изделия",
	"Родился в маленьком городе, но помогает большому миру"
];

var currentSplash = 0;
function showNextSplash() {
	if(++currentSplash > 5) {
		currentSplash = 1;
    };
	
    $("#splash-1").attr("src", "/img/splash/" + currentSplash + ".png");
    $("#welcome").fadeOut(SPLASH_ANIMATION_TIME, function(){
		$("#welcome").html(welcome[currentSplash-1]);
		$("#welcome").fadeIn();
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
 * 
 */