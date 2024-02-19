var kidScores = [
    {
        "kid": 19,
        "title": "You wouldn't steal a Hard",
        "score0": "AFS/92,29,5,0,0"
    },
    {
        "kid": 22,
        "title": "Story of Undertale"
    },
    {
        "kid": 5,
        "title": "TECHNOPOLIS 2085",
        "score0": "Sep/544,121,6,1,1"
    },
    {
        "kid": 14,
        "title": "Cannelés au Chocolat",
        "score0": "goldenyoshi22/646,184,13,4,6",
        "score1": "Lilyyy/779,67,6,0,1"
    },
    {
        "kid": 15,
        "title": "Izayoi Ravers",
        "score0": "goldenyoshi22/738,118,46,3,0"
    },
    {
        "kid": 16,
        "title": "10 Things I Hate About You // Jaded",
        "score0": "goldenyoshi22/488,183,28,2,3",
        "score1": "methanal/652,52,0,0,0",
        "score2": "AFS/468,159,61,11,5"
    },
    {
        "kid": 2,
        "title": "HELIX",
        "score0": "Sep/497,124,19,2,2"
    },
    {
        "kid": 20,
        "title": "Start Again"
    },
    {
        "kid": 21,
        "title": "Happy Lucky->Injection!!"
    },
    {
        "kid": 8,
        "title": "Failure Girl [Passable]",
        "score0": "Sep/945,141,8,0,0",
        "score1": "methanal/990,100,3,1,0"
    },
    {
        "kid": 13,
        "title": "Corrupting Wonderland",
        "score0": "Sep/747,202,31,0,2"
    },
    {
        "kid": 11,
        "title": "Made of Fire",
        "score0": "Sep/499,104,25,0,4",
        "score1": "methanal/575,55,2,0,0",
        "score2": "AFS/352,169,76,14,21"
    },
    {
        "kid": 1,
        "title": "Three eyes ~ awa...",
        "score0": "Sep/938,216,30,6,6",
        "score1": "methanal/953,206,39,6,8"
    },
    {
        "kid": 12,
        "title": "How do you pronounce Boaz?",
        "score0": "methanal/594,157,37,6,7"
    },
    {
        "kid": 7,
        "title": "Piercing Snowflake",
        "score0": "methanal/429,85,6,0,2"
    },
    {
        "kid": 23,
        "title": "Crazy Frog",
        "score0": "goldenyoshi22/1581,420,116,46,59",
        "score1": "shianara/893,680,598,51,0"
    },
    {
        "kid": 9,
        "title": "XNOR XNOR XNOR",
        "score0": "Sep/2212,746,200,35,65"
    },
    {
        "kid": 10,
        "title": "true DJ MAG top ranker's song zenpen (katagiri remix)",
        "score0": "goldenyoshi22/1977,763,295,34,71",
        "score1": "methanal/2529,561,37,2,11"
    },
    {
        "kid": 4,
        "title": "Air",
        "score0": "shianara/793,572,270,27,11"
    },
    {
        "kid": 24,
        "title": "Crystal Gravity"
    },
    {
        "kid": 6,
        "title": "FLAMEWALL // STELLAR CORE",
        "score0": "methanal/2845,1000,145,10,40"
    },
    {
        "kid": 17,
        "title": "Ringo's Tea Party",
        "score0": "methanal/1267,351,28,5,12"
    },
    {
        "kid": 3,
        "title": "Apollo"
    },
    {
        "kid": 0,
        "title": "three eyes"
    },
    {
        "kid": 18,
        "title": "Circus Galop"
    },
    {
        "kid": 25,
        "title": "Mighty Little Man",
        "score0": "AFS/78,9,0,0,0"
    },
    {
        "kid": 26,
        "title": "Bakuure! Match Uri no Haken Shoujo - Extra"
    },
    {
        "kid": 27,
        "title": "VULTURE",
        "score0": "methanal/3178,810,120,11,26"
    },
    {
        "kid": 28,
        "title": "najimi breakers",
        "score0": "shianara/585,496,550,133,222"
    },
    {
        "kid": 29,
        "title": "Twinkle Parade"
    },
    {
        "kid": 30,
        "title": "Crazy Loop [Hyper]"
    },
    {
        "kid": 31,
        "title": "Cory in the House [Expert]"
    },
    {
        "kid": 32,
        "title": "EVERYBODY DO THE FLOP [EXPERT]"
    },
    {
        "kid": 33,
        "title": "ISSUE 480",
        "score0": "shianara/713,464,92,3,0",
        "score1": "methanal/1077,173,18,2,2"
    },
    {
        "kid": 34,
        "title": "Unplanned Pregnancy // CATASTROPHIC FAILURE",
        "score0": "goldenyoshi22/231,95,21,4,0"
    }
]

var users = []


function calculate(kid, hits, type = "pulse") {
	let diff = kids[kid].difficulty
	let notes = kids[kid].notes != undefined ? kids[kid].notes : hits[0]+hits[1]+hits[2]+hits[3]+hits[4]
	if (kids[kid].notes == undefined) console.warn(`This kid, ${kids[kid].name} has an unknown amount of notes, so it will be treated as the amount of hits (${notes})`);
	let acc = (hits[0] + hits[1]*0.95 + hits[2]*0.5 + hits[3]*0.2) / notes;
	//console.log(diff, notes, hits, acc)
	switch (type) {
		case "pulse":
		return ((5 * ((1.4 ** diff) * (Math.min(notes, 3737) ** 0.1))) ** (acc)) * Math.min(notes/500, 1)
		break;
		
		case "accuracy":
		return acc;
		break;
	}
	//KP = ((5 * ((1.4 ^ diff) * (min(notes,3737) ^ 0.1))) ^ (acc/100)) * min(notes/500, 1)
}

for (let i = 0; i < kidScores.length; i++) {
	kidScores[i].scores = [];
	for (let k = 0; kidScores[i]["score" + k] != undefined; k++) {
		kidScores[i].scores.push({username: kidScores[i]["score" + k].split("/")[0], hits: kidScores[i]["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)}), kid: i,
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