const topPlayMults = [1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.86, 0.82, 0.78, 0.74, 0.70, 0.65, 0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05]
var users = []

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
                })
                for (let k = 2; k < data.values[i].length; k++) {
                kidScores[kidScores.length - 1][`score${k - 2}`] = data.values[i][k];
                }
            } 
        }).then(kidScores => {
            resolve(kidScores);
        })
	});
}

function calculate(kid, hits, type = "pulse", forceAcc = false) {
	let diff = kids[kid].difficulty;
	let notes = (typeof kids[kid].notes == "number" && !isNaN(kids[kid].notes)) ? kids[kid].notes : hits[0]+hits[1]+hits[2]+hits[3]+hits[4]
	if (kids[kid].notes == undefined) console.warn(`This kid, ${kids[kid].name} has an unknown amount of notes, so it will be treated as the amount of hits (${notes})`);
	let acc = forceAcc == false ? (hits[0] + hits[1]*0.95 + hits[2]*0.5 + hits[3]*0.2) / notes : forceAcc/100;
	//console.log(diff, notes, hits, acc)
	switch (type) {
		case "pulse":
		return ((0.8 * ((10 ** Math.log(diff+1)) * (notes ** 0.1))) ** (acc)) * Math.min(notes/500, 1)
		
		case "accuracy":
		return acc;
	}
	//KP = ((5 * ((1.4 ^ diff) * (min(notes,3737) ^ 0.1))) ^ (acc/100)) * min(notes/500, 1)
}

async function initLeaderboards() {
	await sheetsToScores();
for (let i = 0; i < kidScores.length; i++) {
	kidScores[i].scores = [];
	for (let k = 0; kidScores[i]["score" + k] != undefined; k++) {
		console.log(kidScores);
		kidScores[i].scores.push({username: kidScores[i]["score" + k].split("/")[0], hits: kidScores[i]["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)}), kid: kidScores[i].kid,
		pulse: calculate(i, kidScores[i]["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)})),
		accuracy: calculate(i, kidScores[i]["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)}), "accuracy")})
		let userNames = [];
		for (let m = 0; m < users.length; m++) {
			userNames.push(users[m].username);
		};
		if (!userNames.includes(kidScores[i].scores[k].username)) {
			users.push({username: kidScores[i].scores[k].username, scores: [], pulse: 0});
		};
		users[users.findIndex(item => item.username === kidScores[i].scores[k].username)].scores.push(kidScores[i].scores[k])
	};
};
}

async function initUsers() {
	await sheetsToKids();
	var topPlayMults = [1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.86, 0.82, 0.78, 0.74, 0.70, 0.65, 0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05]
	for (let i = 0; i < users.length; i++) {
		users[i].scores = users[i].scores.sort(function(a, b){return calculate(b.kid, b.hits) - calculate(a.kid, a.hits)})
		for (let k = 0; k < users[i].scores.length && k < topPlayMults.length; k++) {
			users[i].pulse += users[i].scores[k].pulse * topPlayMults[k];
		}
	}
	users = users.sort(function(a, b){return b.pulse - a.pulse})
}