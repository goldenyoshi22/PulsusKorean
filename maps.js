const sortFunctions = {
    "difficulty": (a, b) => {
        return a.difficulty - b.difficulty
    },
    "notes": (a, b) => {
        return a.notes - b.notes
    },
    "skillset": (a, b) => {
        return (a.difficulty - b.difficulty) || a.skill != b.skill;
    }
}

var maps = [];

function sheetsToMaps() {
	maps = [];
	return new Promise((resolve, reject) => {
	fetch("https://sheets.googleapis.com/v4/spreadsheets/1pvhP4uQHJgJMWlVNRFp8KcdKpGm0AaoxDbfiyuY5PEU/values/maps?key=AIzaSyBgkDt4b932s18UsDfSMhrbopwqQwn6H1w")
	.then(response => response.json())
	.then(data => {
		for (let i = 1; i < data.values.length; i++) {
			maps.push({
				"kid": parseInt(data.values[i][0]),
				"name": data.values[i][1],
				"difficulty": parseFloat(data.values[i][2]),
				"skill": data.values[i][3],
				"id": parseInt(data.values[i][4]),
				"author": data.values[i][5],
				"notes": parseInt(data.values[i][6]),
			})
		} 
	}).then(maps => {
		resolve(maps);
	})
	});
}

var sortedMaps = [];

async function sortMaps(method) {
	// i went too hard - jslposu, after code sightread
	sortedMaps = maps.toSorted(sortFunctions[method]);
}