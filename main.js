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
	await sheetsToKids();
	await sheetsToScores();
	sortKids("difficulty");
	initAwardedMaps();
for (let i = 0; i < kidScores.length; i++) {
	kidScores[i].scores = [];
	for (let k = 0; kidScores[i]["score" + k] != undefined; k++) {
		kidScores[i].scores.push({username: kidScores[i]["score" + k].split("/")[0], mods: kidScores[i]["score" + k].split("/")[2] == undefined ? undefined : kidScores[i]["score" + k].split("/")[2].split(","), hits: kidScores[i]["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)}), kid: kidScores[i].kid,
		pulse: calculate(i, kidScores[i]["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)})),
		accuracy: calculate(i, kidScores[i]["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)}), "accuracy")})
		
		//mods
		/*
		bpm:
		pulse*((5 ^ bpm)/5) if <1x
		pulse*bpm if >=1x

		fs:
		if 0.8x or less, 1.03x
		if 0.5x or less, 1.06x

		hw:
		pulse / hw if hw > 1
		pulse / (hw^0.5) if hw <= 1

		at: nuh uh
		nf: 0.8x
		nr: 0.8x
		hd: 1.02x
		fl: 1.1x
		rd: Math.random() * 1.2 (jk)
		*/
		if (kidScores[i].scores[k].mods != undefined) {
			finalMult = 1;
			finalExponent = 1;
			finalString = "";
			//console.log(kidScores[i].scores[k]);
				let modArray = kidScores[i].scores[k].mods;
			for (let modIndex = 0; modIndex < modArray.length; modIndex++) {
				if (modArray[modIndex].startsWith("bpm")) {
					let bpmMod = modArray[modIndex].slice(3);
					if (bpmMod >= 1) finalMult *= bpmMod;
					//else finalMult *= ((25 ** bpmMod) / 25);
					else finalExponent = 1 - (1 - bpmMod)/2;
					finalString += `BPM ${bpmMod}x, `
				}
				if (modArray[modIndex].startsWith("fs")) {
					let fsMod = modArray[modIndex].slice(2);
					if (fsMod <= 0.5) finalMult *= 1.06;
					else if (fsMod <= 0.8) finalMult *= 1.03;
					finalString += `FS ${fsMod}x, `
				}
				if (modArray[modIndex].startsWith("hw")) {
					let hwMod = modArray[modIndex].slice(2);
					if (hwMod > 1) finalMult /= hwMod;
					else finalMult /= (hwMod ** 0.5);
					finalString += `HW ${hwMod}x, `
				}
				if (modArray[modIndex] == "nf") {
					finalMult *= 0.8;
					finalString += `NF, `
				}
				if (modArray[modIndex] == "nr") {
					finalMult *= 0.8;
					finalString += `NR, `
				}
				if (modArray[modIndex] == "hd") {
					finalMult *= 1.02;
					finalString += `HD, `
				}
				if (modArray[modIndex] == "fl") {
					finalMult *= 1.1;
					finalString += `FL, `
				}
			}
			kidScores[i].scores[k].modMult = finalMult;
			kidScores[i].scores[k].modExponent = finalExponent;
			if (finalString == "") kidScores[i].scores[k].modInfo = "None";
			else kidScores[i].scores[k].modInfo = finalString.slice(0, finalString.length - 2);
		} else {
			kidScores[i].scores[k].modMult = 1;
			kidScores[i].scores[k].modExponent = 1;
			kidScores[i].scores[k].modInfo = "";
		}
		kidScores[i].scores[k].pulse *= kidScores[i].scores[k].modMult;
		kidScores[i].scores[k].pulse **= kidScores[i].scores[k].modExponent;
		
		let userNames = [];
		for (let m = 0; m < users.length; m++) {
			userNames.push(users[m].username);
		};
		if (!userNames.includes(kidScores[i].scores[k].username)) {
			users.push({username: kidScores[i].scores[k].username, scores: [], pulse: 0});
		};
		users[users.findIndex(item => item.username === kidScores[i].scores[k].username)].scores.push(kidScores[i].scores[k]);
		kidScores[i].scores.sort(function(a, b){return b.pulse - a.pulse});
	};
};
	for (let i = 0; i < users.length; i++) {
		users[i].scores = users[i].scores.sort(function(a, b){return b.pulse - a.pulse})
		for (let k = 0; k < users[i].scores.length && k < topPlayMults.length; k++) {
			users[i].pulse += users[i].scores[k].pulse * topPlayMults[k];
		}
	}
	users = users.sort(function(a, b){return b.pulse - a.pulse})
	for (let i = 0; i < users.length; i++) {
		users[i].rank = i+1;
		document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td><b style="cursor:pointer;" onclick='showUserProfile(${JSON.stringify(users[i])})'>${users[i].username}</b></td><td>${users[i].pulse.toFixed(3)}p</td>
		<td>${kids[users[i].scores[0].kid].name} ${users[i].scores[0].modInfo == "" ? "" : "[" + users[i].scores[0].modInfo + "]"} ~ ${users[i].scores[0].pulse.toFixed(3)}p (${(users[i].scores[0].accuracy * 100).toFixed(3)}%)</td></tr>`
	};
	document.querySelectorAll("[onclick]").forEach(function(element) {
		element.classList.add("hoverDark")
	});
}

function initAwardedMaps() {
	document.getElementById("awardedMapsTable").innerHTML = `<tr><th>ID</th><th>Title</th><th>Author</th><th>Difficulty</th><th>Skillset</th><th>Notes</th></tr>`
	for (let i = 0; i < sortedKids.length; i++) {
		document.getElementById("awardedMapsTable").innerHTML += `<tr><td title="KID: ${sortedKids[i].kid}">${sortedKids[i].id}</td><td style="cursor:pointer;" onclick="showMapLeaderboard(${i})"><b>${sortedKids[i].name}</b></td><td>${sortedKids[i].author}</td>
		<td style="${sortedKids[i].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(Math.max(sortedKids[i].difficulty, 0))][0]};color:${difficultyColors[Math.floor(Math.max(sortedKids[i].difficulty, 0))][1]};">${sortedKids[i].difficulty}</td>
		<td>${sortedKids[i].skill}</td>
		<td>${isNaN(sortedKids[i].notes) ? "?" : sortedKids[i].notes}</td></tr>`
	}
}

function initUserDisplay() {
	for (let i = 0; i < users.length; i++) {
		document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td><u style="cursor:pointer;" onclick='showUserProfile(${JSON.stringify(users[i])})'>${users[i].username}</u></td><td>${users[i].pulse.toFixed(3)}p</td>
		<td>${kids[users[i].scores[0].kid].name} ${users[i].scores[0].modInfo == "" ? "" : "[" + users[i].scores[0].modInfo + "]"} ~ ${users[i].scores[0].pulse.toFixed(3)}p (${(users[i].scores[0].accuracy * 100).toFixed(3)}%)</td></tr>`
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
	<h3>${targetUser.username} - #${targetUser.rank}</h3>
	Pulse: ${typeof targetUser.pulse != "number" ? "???" : targetUser.pulse.toFixed(3)}p
	`
	
	let pendHTML = `<table><tr><th>Map</th><th>Difficulty</th><th>Accuracy</th><th>Pulse</th><th>Mods</th></tr>`
	
	for (let i = 0; i < targetUser.scores.length; i++) {
		let currentScore = targetUser.scores[i]
		pendHTML += `
		<tbody><tr>
		<td>${kids[currentScore.kid].name}</td>
		<td style="${kids[currentScore.kid].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(Math.max(kids[currentScore.kid].difficulty, 0))][0]};color:${difficultyColors[Math.floor(Math.max(kids[currentScore.kid].difficulty, 0))][1]};">${kids[currentScore.kid].difficulty}</td>
		<td title="Pulsus Accuracy: ${((currentScore.hits[0]*100+currentScore.hits[1]*100+currentScore.hits[2]*50+currentScore.hits[3]*20)/(kids[currentScore.kid].notes)).toFixed(3)}%" ${currentScore.hits[2]+currentScore.hits[3]+currentScore.hits[4] == 0 ? "style='background:-webkit-linear-gradient(left, #66CFFF, #DE66FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'" : (currentScore.hits[4] == 0 ? "style='color:yellow;'" : "")}>${(currentScore.accuracy * 100).toFixed(3)}%</td>
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
	mapID = sortedKids[mapID].kid;
	let pendHTML = `<tr><th>Rank</th><th>User</th><th>Accuracy</th><th>Pulse</th><th>Mods</th></tr>`;
	
	for (let i = 0; i < kidScores[mapID].scores.length; i++) {
		let currentScore = kidScores[mapID].scores[i];
		pendHTML += `
		<tbody><tr>
		<td>#${i+1}</td>
		<td>${currentScore.username}</td>
		<td title="Pulsus Accuracy: ${((currentScore.hits[0]*100+currentScore.hits[1]*100+currentScore.hits[2]*50+currentScore.hits[3]*20)/(kids[currentScore.kid].notes)).toFixed(3)}%" ${currentScore.hits[2]+currentScore.hits[3]+currentScore.hits[4] == 0 ? "style='background:-webkit-linear-gradient(left, #66CFFF, #DE66FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'" : (currentScore.hits[4] == 0 ? "style='color:yellow;'" : "")}>${(currentScore.accuracy * 100).toFixed(3)}%</td>
		<td>${currentScore.pulse.toFixed(3)}p</td>
		<td>${currentScore.modInfo} ${currentScore.modInfo == "" ? "None" : "(" + currentScore.modMult.toFixed(3) + "x)<sup>" + (currentScore.modExponent == 1 ? "" : currentScore.modExponent.toFixed(3)) + "</sup>"}</td>
		</tr></tbody>`
	}
		
	document.getElementById("mapLeaderboardText").innerHTML = `${kidScores[mapID].title} - Leaderboard`;
	document.getElementById("mapLeaderboardTable").innerHTML = pendHTML;
	
	document.getElementById("mapLeaderboardText").scrollIntoView({behavior: "smooth"});
}