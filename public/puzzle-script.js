var num = Number(document.getElementById("codes-num").innerHTML);
var codes = document.getElementById("codes");
var answers = document.getElementById("answers").innerHTML.split(',');
var message = document.getElementById("code-message").innerHTML;
var skipTimer = document.getElementById("skip-time").innerHTML;
var message = document.getElementById("code-message").innerHTML;
var hints = JSON.parse(document.getElementById("hints").innerHTML);

// Вывод сообщения
if (message != ""){
	var alert = document.createElement('div');
	if (message == "Right answer") {
		alert.className = 'alert alert-success';
		alert.innerHTML = "Код введён верно";
	} 
	else {
		alert.className = 'alert alert-danger';
		alert.innerHTML = "Код введён не верно";
	}
	document.getElementById("menu").insertBefore(alert,document.getElementById("codes"));
}

// Вывод секторов с кодами
for (i = 0; i<num; i++) {
	var code = document.createElement('div');
	
	if (answers[i] == "none") {
		code.innerHTML = 'Сектор '+(i+1)+': код не введён';
		code.className = 'text-danger';
	}
	else {
		code.innerHTML = 'Сектор '+(i+1)+': '+answers[i];
		code.className = 'text-success';
	}
	codes.appendChild(code);
}

// Вывод подсказок
for (var i = 0; i<hints.length; i++) {
	var hint = document.createElement('div');
	var text = "Подсказка "+i+": ";

	if (hints[i].status == "wait") {
		text += hints[i].val;
	}
	else if (hints[i].status == "display") {
		text += hints[i].val;
	}
	else if (hints[i].status == "suggest") {
		text += "взять за " + hints[i].val + " штрафных минут";
	}

	hint.innerHTML = text;
	document.getElementById("hints-sector").appendChild(hint);
}

// Обработка таймера
if (skipTimer != '00:00:00') startTimer();
function startTimer(){
	var arr = skipTimer.split(':');
	var hours = arr[0];
	var minutes = arr[1];
	var seconds = arr[2];
	if (hours == 0 && minutes == 0 && seconds == 0){
		location.reload();
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
	skipTimer = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
	document.getElementById("skip-time").innerHTML = skipTimer;
	setTimeout(startTimer, 1000);
}

function formatTime(time){
	time = Number.parseInt(time);
	if (time < 10) return "0" + time
	else return time
}
