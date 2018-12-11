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
var active_hints = [];
for (var i = 0; i<hints.length; i++) {
	var hint = document.createElement('div');
	var text = "Подсказка "+(i+1)+": ";

	if (hints[i].status == "wait") {
		hint.setAttribute('class','text-danger');
		text += 'откроется через '+hints[i].val;
		document.getElementById("hints-sector").appendChild(hint);
		active_hints.push(hint);
	}
	else if (hints[i].status == "display") {
		hint.setAttribute('class','text-success');
		text += hints[i].val;
		document.getElementById("hints-sector").appendChild(hint);
	}
	else if (hints[i].status == "suggest") {
		var form = document.createElement('form');
		var btn = document.createElement('input');
		btn.setAttribute('type','submit');
		btn.setAttribute('formaction','/take_hint?id='+hints[i].id);
		btn.setAttribute('formmethod','post');
		btn.setAttribute('value','Взять');
		btn.setAttribute('name','take');
		btn.setAttribute('class','btn btn-primary');

		form.appendChild(btn);

		text += "взять за " + hints[i].val + " штрафных минут";
		document.getElementById("hints-sector").appendChild(hint);
		document.getElementById("hints-sector").appendChild(form);
	}

	hint.innerHTML = text;
}

// Обработка таймера
if (skipTimer != '00:00:00') startTimer();
function startTimer(){
	var tick = function(skipTimer) {
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
		return formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
	}
	skipTimer = tick(skipTimer);
	document.getElementById("skip-time").innerHTML = skipTimer;

	for (var i = 0; i<active_hints.length; i++) 
		active_hints[i].innerHTML = active_hints[i].innerHTML.slice(0,29) + tick(active_hints[i].innerHTML.slice(-8));
	
	setTimeout(startTimer, 990);
}

function formatTime(time){
	time = Number.parseInt(time);
	if (time < 10) return "0" + time
	else return time
}
