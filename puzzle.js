var puzzle = {
	nickname: "Noname",
	title: "Странный памятник",
	html: "/puzzles/1.html",
	codes_num: 5,
	answers: ["none","none","none","none","none"]
}

var answers = ["ans1","ans2","ans3","ans4","ans5"]

var check_code = function(code) {
	for (i = 0; i<puzzle.codes_num; i++)
		if (answers[i] == code) {
			puzzle.answers[i] = code;
			return true;
		}
	return false;
}

var register = function (nickname) {
	nickname == "" ? puzzle.nickname = "Noname" : puzzle.nickname = nickname;
}

module.exports.puzzle = puzzle;
module.exports.check = check_code;
module.exports.register = register;