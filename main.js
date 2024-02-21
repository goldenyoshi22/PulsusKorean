var difficultyColors = [
["#4a86e8", "#000000"], //0
["#00ffff", "#000000"], //1
["#00ff00", "#000000"], //2
["#ffff00", "#000000"], //3
["#ff9900", "#000000"], //4
["#ff0000", "#000000"], //5
["#ff00ff", "#000000"], //6
["#9900ff", "#000000"], //7
["#0000ff", "#000000"], //8
["#3d85c6", "#000000"], //9
["#c9daf8", "#000000"], //10
["#000000", "#c9daf8"], //11
["#000000", "#3d85c6"], //12
["#000000", "#0000ff"], //13
["#000000", "#9900ff"], //14
["#000000", "#ff00ff"], //15
["#000000", "#ff0000"], //16
["#000000", "#666666"], //17
]

async function initAll() {
	await sheetsToKids();
	await sheetsToScores();
	sortKids("difficulty");
	document.getElementById("awardedMapsTable").innerHTML == `<tr><th>ID</th><th>Title</th><th>Author</th><th>Difficulty</th><th>Skillset</th></tr>`
	for (let i = 0; i < sortedKids.length; i++) {
		document.getElementById("awardedMapsTable").innerHTML += `<tr><td>${sortedKids[i].id}</td><td>${sortedKids[i].name}</td><td>${sortedKids[i].author}</td>
		<td style="${sortedKids[i].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(Math.max(sortedKids[i].difficulty, 0))][0]};color:${difficultyColors[Math.floor(Math.max(sortedKids[i].difficulty, 0))][1]};">${sortedKids[i].difficulty}</td>
		<td>${sortedKids[i].skill}</td></tr>`
	}
for (let i = 0; i < kidScores.length; i++) {
	kidScores[i].scores = [];
	for (let k = 0; kidScores[i]["score" + k] != undefined; k++) {
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
	var topPlayMults = [1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.86, 0.82, 0.78, 0.74, 0.70, 0.65, 0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05]
	for (let i = 0; i < users.length; i++) {
		users[i].scores = users[i].scores.sort(function(a, b){return calculate(b.kid, b.hits) - calculate(a.kid, a.hits)})
		for (let k = 0; k < users[i].scores.length && k < topPlayMults.length; k++) {
			users[i].pulse += users[i].scores[k].pulse * topPlayMults[k];
		}
	}
	users = users.sort(function(a, b){return b.pulse - a.pulse})
	for (let i = 0; i < users.length; i++) {
		document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td><u style="cursor:pointer;" onclick='showUserProfile(${JSON.stringify(users[i])})'>${users[i].username}</u></td><td>${users[i].pulse.toFixed(3)}p</td>
		<td>${kids[users[i].scores[0].kid].name} ~ ${users[i].scores[0].pulse.toFixed(3)}p (${(users[i].scores[0].accuracy * 100).toFixed(3)}%)</td></tr>`
	};
}

function initAwardedMaps() {
	document.getElementById("awardedMapsTable").innerHTML == `<tr><th>ID</th><th>Title</th><th>Author</th><th>Difficulty</th><th>Skillset</th></tr>`
	for (let i = 0; i < sortedKids.length; i++) {
		document.getElementById("awardedMapsTable").innerHTML += `<tr><td>${sortedKids[i].id}</td><td>${sortedKids[i].name}</td><td>${sortedKids[i].author}</td>
		<td style="${sortedKids[i].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(Math.max(sortedKids[i].difficulty, 0))][0]};color:${difficultyColors[Math.floor(Math.max(sortedKids[i].difficulty, 0))][1]};">${sortedKids[i].difficulty}</td>
		<td>${sortedKids[i].skill}</td></tr>`
	}
}

function initUserDisplay() {
	for (let i = 0; i < users.length; i++) {
		document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td><u style="cursor:pointer;" onclick='showUserProfile(${JSON.stringify(users[i])})'>${users[i].username}</u></td><td>${users[i].pulse.toFixed(3)}p</td>
		<td>${kids[users[i].scores[0].kid].name} ~ ${users[i].scores[0].pulse.toFixed(3)}p (${(users[i].scores[0].accuracy * 100).toFixed(3)}%)</td></tr>`
	};
}

/*
initAwardedMaps();
initLeaderboards();
initUsers();
initUserDisplay();
*/

initAll();

function showUserProfile(targetUser) {
	console.log(targetUser);
	if (typeof targetUser == "string") targetUser = JSON.parse(targetUser);
	
	document.getElementById("profileInfo").innerHTML = `
	<h3>${targetUser.username} - #?</h3>
	Pulse: ${typeof targetUser.pulse != "number" ? "???" : targetUser.pulse.toFixed(3)}p
	`
	
	let pendHTML = `<table><tr><th>Map</th><th>Difficulty</th><th>Accuracy</th><th>Pulse</th></tr>`
	
	for (let i = 0; i < targetUser.scores.length; i++) {
		let currentScore = targetUser.scores[i]
		pendHTML += `
		<tr>
		<td>${kids[currentScore.kid].name}</td>
		<td style="${kids[currentScore.kid].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(Math.max(kids[currentScore.kid].difficulty, 0))][0]};color:${difficultyColors[Math.floor(Math.max(kids[currentScore.kid].difficulty, 0))][1]};">${kids[currentScore.kid].difficulty}</td>
		<td>${(currentScore.accuracy * 100).toFixed(3)}%</td>
		<td>${currentScore.pulse.toFixed(3)}p</td>
		</tr>
		`
	}
	
	document.getElementById("profileScores").innerHTML = `${pendHTML}</table>`;
}