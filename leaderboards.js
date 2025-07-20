var kidScores = []; //scores on maps
var users = []; //player profiles

//gets user scores from google sheet
function sheetsToScores() {
	return new Promise((resolve, reject) => {
	kidScores = [];
	fetch("https://sheets.googleapis.com/v4/spreadsheets/1pvhP4uQHJgJMWlVNRFp8KcdKpGm0AaoxDbfiyuY5PEU/values/Copy+of+scores?key=AIzaSyBgkDt4b932s18UsDfSMhrbopwqQwn6H1w")
	.then(response => response.json())
	.then(data => {
		for (let i = 1; i < data.values.length; i++) {
			kidScores.push({
				"kid": parseInt(data.values[i][0]),
				"title": data.values[i][1],
			});
			for (let k = 2; k < data.values[i].length; k++) {
			kidScores[kidScores.length - 1][`score${k - 2}`] = data.values[i][k];
			}
		} 
	}).then(kidScores => {
		resolve(kidScores);
	})
	});
}

//calculate either pulse or acc
/*
kid = koreanID, hits = array for judgements [marv,great,good,ok,miss],
type = "pulse" for pulse or "accuracy" for accuracy%, forceAcc = force accuracy% for hypothetical plays
*/
function calculate(kid, hits, type = "pulse", forceAcc = false) {
	let diff = kids[kid].difficulty;
	let notes = (typeof kids[kid].notes == "number" && !isNaN(kids[kid].notes)) ? kids[kid].notes : hits[0]+hits[1]+hits[2]+hits[3]+hits[4]
	if (kids[kid].notes == undefined) console.warn(`This kid, ${kids[kid].name} has an unknown amount of notes, so it will be treated as the amount of hits (${notes})`);
	let acc = forceAcc == false ? (hits[0] + hits[1]*0.95 + hits[2]*0.5 + hits[3]*0.2) / notes : forceAcc/100;
	//console.log(diff, notes, hits, acc)
	switch (type) {
		case "pulse":
		return ((0.8 * ((10 ** Math.log(diff+1)) * (notes ** 0.1))) ** (acc)) * (Math.min(notes/500, 1) ** 1);
		break;
		
		case "accuracy":
		return acc;
		break;
	}
	//this below is severely ourdated dont worry about it lol
	//KP = ((5 * ((1.4 ^ diff) * (min(notes,3737) ^ 0.1))) ^ (acc/100)) * min(notes/500, 1)
}