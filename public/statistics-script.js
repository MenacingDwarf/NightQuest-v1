var head = document.getElementById("table-head");
var table = document.getElementById("table");
var stats = JSON.parse(document.getElementById("info").innerHTML);

for (var i=0; i<stats.length; i++) {
	var line = document.createElement('tr');
	var td = document.createElement('td');
	td.innerHTML = i+1;
	line.appendChild(td);
	var td = document.createElement('td');
	td.innerHTML = stats[i].login;
	line.appendChild(td);
	var td = document.createElement('td');
	td.innerHTML = stats[i].summary_time;
	line.appendChild(td);
	var td = document.createElement('td');
	td.innerHTML = stats[i].puzzles_done;
	line.appendChild(td);
	var td = document.createElement('td');
	td.innerHTML = stats[i].puzzle_title;
	line.appendChild(td);
	table.appendChild(line);
}