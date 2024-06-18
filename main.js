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

var topPlayMults = [1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.86, 0.82, 0.78, 0.74, 0.70, 0.65, 0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05]

async function initAll() {
	await sheetsToMaps();
	await sheetsToScores();
	sortMaps("difficulty");
	document.getElementById("awardedMapsTable").innerHTML = `<tr><th>ID</th><th>Title</th><th>Author</th><th>Difficulty</th><th>Skillset</th><th>Notes</th></tr>`
	for (let i = 0; i < sortedMaps.length; i++) {
		document.getElementById("awardedMapsTable").innerHTML += createMap(sortedMaps[i], i);
	}
	for (let i = 0; i < kidScores.length; i++) {
		handleUserModifiers(kidScores[i], i);
	};

	userFindKoreanPulse();
	users = users.sort(function(a, b){return b.pulse - a.pulse})
	for (let i = 0; i < users.length; i++) {
		users[i].rank = i+1;
		document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td><b style="cursor:pointer;" onclick='showUserProfile(${JSON.stringify(users[i])})'>${users[i].username}</b></td><td>${users[i].pulse.toFixed(3)}p</td>
		<td>${maps[users[i].scores[0].kid].name} ${users[i].scores[0].modInfo == "" ? "" : "[" + users[i].scores[0].modInfo + "]"} ~ ${users[i].scores[0].pulse.toFixed(3)}p (${(users[i].scores[0].accuracy * 100).toFixed(3)}%)</td></tr>`
	}
	document.querySelectorAll("[onclick]").forEach(function(element) {
		element.classList.add("hoverDark")
	});
}

function initAwardedMaps() {
	document.getElementById("awardedMapsTable").innerHTML = `<tr><th>ID</th><th>Title</th><th>Author</th><th>Difficulty</th><th>Skillset</th><th>Notes</th></tr>`
	for (let i = 0; i < sortedMaps.length; i++) {
		document.getElementById("awardedMapsTable").innerHTML += `<tr><td>${sortedMaps[i].id}</td><td>${sortedMaps[i].name}</td><td>${sortedMaps[i].author}</td>
		<td style="${sortedMaps[i].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(Math.max(sortedMaps[i].difficulty, 0))][0]};color:${difficultyColors[Math.floor(Math.max(sortedMaps[i].difficulty, 0))][1]};">${sortedMaps[i].difficulty}</td>
		<td>${sortedMaps[i].skill}</td>
		<td>${isNaN(sortedMaps[i].notes) ? "?" : sortedMaps[i].notes}</td></tr>`
	}
}

function initUserDisplay() {
	for (let i = 0; i < users.length; i++) {
		document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td><u style="cursor:pointer;" onclick='showUserProfile(${JSON.stringify(users[i])})'>${users[i].username}</u></td><td>${users[i].pulse.toFixed(3)}p</td>
		<td>${kids[users[i].scores[0].kid].name} ${users[i].scores[0].modInfo == "" ? "" : "[" + users[i].scores[0].modInfo + "]"} ~ ${users[i].scores[0].pulse.toFixed(3)}p (${(users[i].scores[0].accuracy * 100).toFixed(3)}%)</td></tr>`
	}
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
	<h3>${targetUser.username} - #${targetUser.rank}</h3>
	Pulse: ${typeof targetUser.pulse != "number" ? "???" : targetUser.pulse.toFixed(3)}p
	`
	
	let pendHTML = `<table><tr><th>Map</th><th>Difficulty</th><th>Accuracy</th><th>Pulse</th><th>Mods</th></tr>`
	
	for (let i = 0; i < targetUser.scores.length; i++) {
		let currentScore = targetUser.scores[i]
		pendHTML += `
		<tbody><tr>
		<td>${maps[currentScore.kid].name}</td>
		<td style="${maps[currentScore.kid].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(Math.max(maps[currentScore.kid].difficulty, 0))][0]};color:${difficultyColors[Math.floor(Math.max(maps[currentScore.kid].difficulty, 0))][1]};">${maps[currentScore.kid].difficulty}</td>
		<td title="Pulsus Accuracy: ${((currentScore.hits[0]*100+currentScore.hits[1]*100+currentScore.hits[2]*50+currentScore.hits[3]*20)/(maps[currentScore.kid].notes)).toFixed(3)}%" ${currentScore.hits[2]+currentScore.hits[3]+currentScore.hits[4] == 0 ? "style='background:-webkit-linear-gradient(left, #66CFFF, #DE66FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'" : (currentScore.hits[4] == 0 ? "style='color:yellow;'" : "")}>${(currentScore.accuracy * 100).toFixed(3)}%</td>
		<td title="Weighted: ${(currentScore.pulse * topPlayMults[i]).toFixed(3)}p">${currentScore.pulse.toFixed(3)}p</td>
		<td>${currentScore.modInfo} ${currentScore.modInfo == "" ? "None" : "(" + currentScore.modMult.toFixed(3) + "x)<sup>" + (currentScore.modExponent == 1 ? "" : currentScore.modExponent.toFixed(3)) + "</sup>"}</td>
		</tr></tbody>
		`
	}
	
	document.getElementById("profileScores").innerHTML = `${pendHTML}</table>`;
	document.getElementById("userProfileText").innerHTML = `${targetUser.username}'s Profile`;
	document.getElementById("userProfileText").scrollIntoView({behavior: "smooth"});
}

function showMapLeaderboard(mapID) {
	mapID = sortedMaps[mapID].kid;
	let pendHTML = `<tr><th>Rank</th><th>User</th><th>Accuracy</th><th>Pulse</th><th>Mods</th></tr>`;
	
	for (let i = 0; i < kidScores[mapID].scores.length; i++) {
		let currentScore = kidScores[mapID].scores[i];
		pendHTML += `
		<tbody><tr>
		<td>#${i+1}</td>
		<td>${currentScore.username}</td>
		<td title="Pulsus Accuracy: ${((currentScore.hits[0]*100+currentScore.hits[1]*100+currentScore.hits[2]*50+currentScore.hits[3]*20)/(maps[currentScore.kid].notes)).toFixed(3)}%" ${currentScore.hits[2]+currentScore.hits[3]+currentScore.hits[4] == 0 ? "style='background:-webkit-linear-gradient(left, #66CFFF, #DE66FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'" : (currentScore.hits[4] == 0 ? "style='color:yellow;'" : "")}>${(currentScore.accuracy * 100).toFixed(3)}%</td>
		<td>${currentScore.pulse.toFixed(3)}p</td>
		<td>${currentScore.modInfo} ${currentScore.modInfo == "" ? "None" : "(" + currentScore.modMult.toFixed(3) + "x)<sup>" + (currentScore.modExponent == 1 ? "" : currentScore.modExponent.toFixed(3)) + "</sup>"}</td>
		</tr></tbody>`
	}
		
	document.getElementById("mapLeaderboardText").innerHTML = `${kidScores[mapID].title} - Leaderboard`;
	document.getElementById("mapLeaderboardTable").innerHTML = pendHTML;
	
	document.getElementById("mapLeaderboardText").scrollIntoView({behavior: "smooth"});
}

// doin' this so you can actually read.
function createMap(map, i) {
	let format = '<tr><td>${1}</td><td style="cursor:pointer;" onclick="showMapLeaderboard(${2})"><b>${3}</b></td><td>${4}</td>'
				+'<td style="${5}background-color:${6};color:${7};">${8}</td>'
				+'<td>${9}</td>'
				+'<td>${10}</td></tr>';

	format = format.replace("${1}", map.id);
	format = format.replace("${2}", i);
	format = format.replace("${3}", map.name);
	format = format.replace("${4}", map.author);

	const color = difficultyColors[Math.floor(Math.max(map.difficulty, 0))];
	if (map.difficulty >= 17) {
		format = format.replace("${5}", "font-style:italic;text-decoration:underline line-through;");
	} else {
		format = format.replace("${5}", "");
	}

	format = format.replace("${6}", color[0]);
	format = format.replace("${7}", color[1]);
	format = format.replace("${8}", map.difficulty);
	format = format.replace("${9}", map.skill);
	format = format.replace("${10}", isNaN(map.notes)? "?" : map.notes)

	return format;
}