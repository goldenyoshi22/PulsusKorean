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

function initAwardedMaps() {
	document.getElementById("awardedMapsTable").innerHTML == `<tr><th>ID</th><th>Title</th><th>Author</th><th>Difficulty</th><th>Skillset</th></tr>`
	for (let i = 0; i < sortedKids.length; i++) {
		document.getElementById("awardedMapsTable").innerHTML += `<tr><td>${sortedKids[i].id}</td><td>${sortedKids[i].name}</td><td>${sortedKids[i].author}</td>
		<td style="${sortedKids[i].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(sortedKids[i].difficulty)][0]};color:${difficultyColors[Math.floor(sortedKids[i].difficulty)][1]};">${sortedKids[i].difficulty}</td>
		<td>${sortedKids[i].skill}</td></tr>`
	}
}

initAwardedMaps();

for (let i = 0; i < users.length; i++) {
	document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td><u style="cursor:pointer;" onclick='showUserProfile(${JSON.stringify(users[i])})'>${users[i].username}</u></td><td>${users[i].pulse.toFixed(3)}p</td>
	<td>${kids[users[i].scores[0].kid].name} ~ ${users[i].scores[0].pulse.toFixed(3)}p (${(users[i].scores[0].accuracy * 100).toFixed(3)}%)</td></tr>`
}

function showUserProfile(targetUser) {
	console.log(targetUser);
	if (typeof targetUser == "string") targetUser = JSON.parse(targetUser);
	
	document.getElementById("profileInfo").innerHTML = `
	<h3>${targetUser.username} - #?</h3>
	Pulse: ${targetUser.pulse.toFixed(3)}p
	`
	
	let pendHTML = `<table><tr><th>Map</th><th>Difficulty</th><th>Accuracy</th><th>Pulse</th></tr>`
	
	for (let i = 0; i < targetUser.scores.length; i++) {
		let currentScore = targetUser.scores[i]
		pendHTML += `
		<tr>
		<td>${kids[currentScore.kid].name}</td>
		<td style="${kids[currentScore.kid].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(kids[currentScore.kid].difficulty)][0]};color:${difficultyColors[Math.floor(kids[currentScore.kid].difficulty)][1]};">${kids[currentScore.kid].difficulty}</td>
		<td>${(currentScore.accuracy * 100).toFixed(3)}%</td>
		<td>${currentScore.pulse.toFixed(3)}p</td>
		</tr>
		`
	}
	
	document.getElementById("profileScores").innerHTML = `${pendHTML}</table>`;
}