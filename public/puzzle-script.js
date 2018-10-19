var num = Number(document.getElementById("codes-num").innerHTML);
var codes = document.getElementById("codes");
var answers = document.getElementById("answers").innerHTML.split(',');
var message = document.getElementById("code-message").innerHTML;

if (message != "") alert(document.getElementById("code-message").innerHTML);

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