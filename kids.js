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
				"kid": parseInt(data.values[i][0]),
				"name": data.values[i][1],
				"difficulty": parseFloat(data.values[i][2]),
				"skill": data.values[i][3],
				"id": parseInt(data.values[i][4]),
				"author": data.values[i][5],
				"notes": parseInt(data.values[i][6]),
			})
		} 
	}).then(kids => {
		resolve(kids);
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