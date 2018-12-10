if (document.getElementById("msg").innerHTML == "undefined user") {
	alert('Пользователь не зарегистрирован!');
}
else if (document.getElementById("msg").innerHTML == "wrong password") {
	alert('Неправильный пароль!');
}
else if (document.getElementById("msg").innerHTML == "no places") {
	alert('Свободных мест нет!');
}
else if (document.getElementById("msg").innerHTML == "already registered") {
	alert('Пользователь с таким логином уже зарегистрирован!');
}
else if (document.getElementById("msg").innerHTML == "registered") {
	alert('Регистрация прошла успешно!');
}

var rem = document.getElementById("start").innerHTML;
var Timer = "00:00:00";
if (rem == '00:00:00') document.getElementById("submit").removeAttribute('disabled');
else {
	document.getElementById("register").removeAttribute('disabled'); 							
	var timer = document.createElement("span");
	timer.innerHTML = 'Начало квеста через: '+ rem;
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
		document.getElementById("register").setAttribute('disabled','disabled');
		document.getElementById("content").removeChild(document.getElementById("timer"))
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
	document.getElementById("timer").innerHTML = 'Начало квеста через: '+ Timer;
	setTimeout(startTimer, 1000);
}

function formatTime(time){
	time = Number.parseInt(time);
	if (time < 10) return "0" + time
	else return time
}