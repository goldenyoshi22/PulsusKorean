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

for (let i = 0; i < kids.length; i++) {
	document.getElementById("awardedMapsTable").innerHTML += `<tr><td>${kids[i].id}</td><td>${kids[i].name}</td><td>${kids[i].author}</td>
	<th style="${kids[i].difficulty >= 17 ? "font-style:italic;text-decoration:underline line-through;" : ""}background-color:${difficultyColors[Math.floor(kids[i].difficulty)][0]};color:${difficultyColors[Math.floor(kids[i].difficulty)][1]};">${kids[i].difficulty}</td>
	<td>${kids[i].skill}</td></tr>`
}

for (let i = 0; i < users.length; i++) {
	document.getElementById("leaderboardTable").innerHTML += `<tr><td>#${i + 1}</td><td>${users[i].username}</td><td>${users[i].pulse.toFixed(3)}</td>
	<td>${kids[users[i].scores[0].kid].name} ~ ${users[i].scores[0].pulse.toFixed(3)}p</td></tr>`
}