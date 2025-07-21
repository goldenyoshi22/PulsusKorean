//waits for google sheet and then pushes maps
//also KID stands for Korean ID, trust me this is definitely not a dumb and forced acronym
var kids = [];
function sheetsToKids() {
	kids = [];
	return new Promise((resolve, reject) => {
	fetch("https://sheets.googleapis.com/v4/spreadsheets/1pvhP4uQHJgJMWlVNRFp8KcdKpGm0AaoxDbfiyuY5PEU/values/maps?key=AIzaSyBgkDt4b932s18UsDfSMhrbopwqQwn6H1w")
	.then(response => response.json())
	.then(data => {
		for (let i = 1; i < data.values.length; i++) {
			kids.push({
				"kid": parseInt(data.values[i][0] ?? -1),
				"name": data.values[i][1] ?? "",
				"difficulty": parseFloat(data.values[i][2] ?? -1),
				"skill": data.values[i][3] ?? "",
				"id": parseInt(data.values[i][4] ?? -1),
				"author": data.values[i][5] ?? "",
				"notes": parseInt(data.values[i][6] ?? -1),
				"skill2": data.values[i][7] ?? ""
			})
		} 
	}).then(kids => {
		resolve(kids);
	});
	});
};

var kidOfTheDay = [0, 0, 0];
function sheetsToDaily() {
	kidOfTheDay = [];
	return new Promise((resolve, reject) => {
	fetch("https://sheets.googleapis.com/v4/spreadsheets/1pvhP4uQHJgJMWlVNRFp8KcdKpGm0AaoxDbfiyuY5PEU/values/Sheet9!A2:C2?key=AIzaSyBgkDt4b932s18UsDfSMhrbopwqQwn6H1w")
	.then(response => response.json())
	.then(data => {
		kidOfTheDay.push(parseInt(data.values[0][0]));
		kidOfTheDay.push(parseInt(data.values[0][1]));
		kidOfTheDay.push(parseInt(data.values[0][2]));
	}).then(kidOfTheDay => {
		resolve(kidOfTheDay);
	});
	});
};

//just sorting the maps by a sorting method chosen, this feature will be added to the html one day...
var sortedKids = [];
async function sortKids(method) {
	sortedKids = [];
	switch (method) {
		case "difficulty":
		sortedKids = kids.toSorted(function(a, b) {return a.difficulty - b.difficulty});
		break;
		
		case "notes":
		sortedKids = kids.toSorted(function(a, b) {return a.notes - b.notes});
		break;
		
		case "skillset":
		sortedKids = kids.toSorted(function(a, b) {return a.difficulty - b.difficulty});
		sortedKids.sort(function(a, b) {return a.skill.localeCompare(b.skill)});
		break;
	}
}

var filteredKids = [];
async function filterMaps(filtering = []) {
	//[0] is method, [1] is filtering. (example, ["title", "three"] searches for maps with "three"),
	//["difficulty", [1.5, 6]] searches for maps from difficulties 1.5 to 6
	filteredKids = [];
	filteredKids = sortedKids;
	if (filtering.length == 0 || typeof filtering != "object") {
		console.log("invalid filter");
		return;
	}
	for (let i = 0; i < filtering.length; i++) {
		switch (filtering[i][0]) {
			case "id":
				filteredKids = filteredKids.filter((kid) => kid.id.toString().includes(filtering[i][1]));
			break;
			
			case "title":
				filteredKids = filteredKids.filter((kid) => kid.name.toLowerCase().includes(filtering[i][1].toLowerCase()));
			break;
			
			case "author":
				filteredKids = filteredKids.filter((kid) => kid.author.toLowerCase().includes(filtering[i][1].toLowerCase()));
			break;
			
			case "difficulty":
				filteredKids = filteredKids.filter((kid) => kid.difficulty >= parseFloat(filtering[i][1][0]) && kid.difficulty <= parseFloat(filtering[i][1][1]));
			break;
			
			case "skillset":
				filteredKids = filteredKids.filter((kid) => kid.skill.toLowerCase().includes(filtering[i][1].toLowerCase()) || kid.skill2.toLowerCase().includes(filtering[i][1].toLowerCase()));
			break;
			
			case "notes":
				filteredKids = filteredKids.filter((kid) => kid.notes >= parseFloat(filtering[i][1][0]) && kid.notes <= parseFloat(filtering[i][1][1]));
			break;
		}
	}
}

async function bigBoyFilter() {
	filterMaps([
	["id", document.getElementById("filterIDInput").value],
	["title", document.getElementById("filterTitleInput").value],
	["author", document.getElementById("filterAuthorInput").value],
	["difficulty", [document.getElementById("filterDifficultyMinInput").value == "" ? -1 : document.getElementById("filterDifficultyMinInput").value, document.getElementById("filterDifficultyMaxInput").value == "" ? 18 : document.getElementById("filterDifficultyMaxInput").value]],
	["skillset", document.getElementById("filterSkillsetInput").value],
	["notes", [document.getElementById("filterNotesMinInput").value == "" ? 0 : document.getElementById("filterNotesMinInput").value, document.getElementById("filterNotesMaxInput").value == "" ? Infinity : document.getElementById("filterNotesMaxInput").value]],
	]);
}

//MOST OF THIS RANDOM CODE was unneeded..... well, i used it in apps script for google sheets, so it was pretty useful actually :D
var randomEasyKidWeights = [];
var randomDifficultKidWeights = [];
//Sorry for ai code, i dont know how to make pseudorandom. And then i was too lazy to figure out weighted index
function randomForDate(dateInput, hash = 2166136261) {
  const dateStr = new Date(dateInput).toISOString().slice(0, 10);

  // FNV-1a hash
  // let hash = 2166136261;
  for (let i = 0; i < dateStr.length; i++) {
    hash ^= dateStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  // LCG
  let seed = hash >>> 0;
  seed = (seed * 1664525 + 1013904223) >>> 0;

  return seed / 4294967296;
}

//Not the same, only works with specific array thingy.   [0] = id, [1] = chance
function getWeightedIndex(weights, t) {
  const total = weights.reduce((a, b) => a + b[1], 0);
  const target = t * total;
  
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i][1];
    if (target < cumulative) {
      return i;
    }
  }

  // Edge case: if t == 1 exactly
  return weights.length - 1;
}