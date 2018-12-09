/*var tick = 1;
function foo() {
 var banner= Array('https://www.film.ru/sites/default/files/styles/epsa_1024x450/public/34279270-1011426.jpg', 
 	'https://cs8.pikabu.ru/post_img/big/2017/12/19/10/1513702343138630971.jpg', 
 	'http://myhdwallpapers.org/wp-content/uploads/2018/02/Superb-Nature-Night-Stars-Man-Winter.jpg');
 document.body.style.backgroundImage = 'url("' + banner[tick-1] + '")';
 tick = tick%banner.length+1
 setTimeout ("foo()",5000);
}
foo();*/

if (document.getElementById("msg").innerHTML == "undefined user") {
	alert('Пользователь не зарегистрирован');
}
else if (document.getElementById("msg").innerHTML == "wrong password") {
	alert('Неправильный пароль');
}

var start = new Date(document.getElementById("start").innerHTML);
var now = new Date();
var Timer = "00:00:00"
if (now > start) document.getElementById("submit").removeAttribute('disabled');
else {
	var ans = new Date(start-now);
	var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 							
	var timer = document.createElement("span");
	timer.innerHTML = rem;
	timer.setAttribute('id','timer');
	document.getElementById("content").appendChild(timer);
	Timer = rem;
	startTimer();
}

function startTimer(){
	var arr = Timer.split(':');
	var hours = arr[0];
	var minutes = arr[1];
	var seconds = arr[2];
	if (hours == 0 && minutes == 0 && seconds == 0){
		document.getElementById("submit").removeAttribute('disabled');
		return;
	}
	else seconds -= 1;
	if (Number.parseInt(seconds) == -1) {
		minutes -= 1;
		seconds = "59";
	}
	if (Number.parseInt(minutes) == -1) {
		hours -= 1;
		minutes = "59";
	}
	Timer = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
	document.getElementById("timer").innerHTML = Timer;
	setTimeout(startTimer, 1000);
}

function formatTime(time){
	time = Number.parseInt(time);
	if (time < 10) return "0" + time
	else return time
}