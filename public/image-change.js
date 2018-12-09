var tick = 1;
function foo() {
 var banner= Array('https://www.film.ru/sites/default/files/styles/epsa_1024x450/public/34279270-1011426.jpg', 
 	'https://cs8.pikabu.ru/post_img/big/2017/12/19/10/1513702343138630971.jpg', 
 	'http://myhdwallpapers.org/wp-content/uploads/2018/02/Superb-Nature-Night-Stars-Man-Winter.jpg');
 document.body.style.backgroundImage = 'url("' + banner[tick-1] + '")';
 tick = tick%banner.length+1
 setTimeout ("foo()",5000);
}
foo();

if (document.getElementById("msg").innerHTML == "undefined user") {
	alert('Пользователь не зарегистрирован');
}
else if (document.getElementById("msg").innerHTML == "wrong password") {
	alert('Неправильный пароль');
}