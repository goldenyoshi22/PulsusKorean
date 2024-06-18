const weightFunctions = {
    "old": (k) => {
        return topPlayMults[k];
    },
    "new": (k) => {
        return (Math.pow((k/12) - 2, 2) / 4);
    }
}

function userFindKoreanPulse() {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];

		user.scores = user.scores.sort(function(a, b){return b.pulse - a.pulse})
        const scores = user.scores;
		for (let k = 0; k < scores.length && k < topPlayMults.length; k++) {
			user.pulse += scores[k].pulse * weightFunctions["new"](k);
		}
	}
}

function handleUserModifiers(kidscore, i) {
    kidscore.scores = [];
    for (let k = 0; kidscore["score" + k] != undefined; k++) {
        console.log(kidscore);
        kidscore.scores.push({
            username: kidscore["score" + k].split("/")[0],
            mods: kidscore["score" + k].split("/")[2] == undefined ? undefined : kidscore["score" + k].split("/")[2].split(","),
            hits: kidscore["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)}),
            kid: kidscore.kid,
            pulse: calculate(i, kidscore["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)})),
            accuracy: calculate(i, kidscore["score" + k].split("/")[1].split(",").map(function(item) {return parseFloat(item)}), "accuracy")
        })
        
        //mods
        /*
        bpm:
        pulse*((5 ^ bpm)/5) if <1x
        pulse*bpm if >=1x

        fs:
        if less than 1.0x
        pulse * (1 + ((1.0 - (fs - 1.0) * 2) ^ 2 / 4) * 0.06)

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

        if (kidscore.scores[k].mods != undefined) {
            finalMult = 1;
            finalString = "";

            let modArray = kidscore.scores[k].mods;
            for (let modIndex = 0; modIndex < modArray.length; modIndex++) {
                if (modIndex) finalString += ", ";
                
                if (modArray[modIndex].startsWith("bpm")) {
                    let bpmMod = modArray[modIndex].slice(3);
                    if (bpmMod >= 1) finalMult *= bpmMod; else finalMult *= ((5 ** bpmMod) / 5);
                    finalString += `BPM ${bpmMod}x`;
                    continue;
                }
                if (modArray[modIndex].startsWith("fs")) {
                    let fsMod = modArray[modIndex].slice(2);
                    //if (fsMod <= 0.5) finalMult *= 1.06;
                    //else if (fsMod <= 0.8) finalMult *= 1.03;
                    if (fsMod < 1.0) finalMult *= 1 + (Math.pow(1.0 - (fsMod - 1.0) * 2, 2) / 4) * 0.06;
                    finalString += `FS ${fsMod}x`;
                    continue;
                }
                if (modArray[modIndex].startsWith("hw")) {
                    let hwMod = modArray[modIndex].slice(2);
                    if (hwMod > 1) finalMult /= hwMod;
                    else finalMult /= (hwMod ** 0.5);
                    finalString += `HW ${hwMod}x`;
                    continue;
                }

                if (modArray[modIndex] == "nf") {
                    finalMult *= 0.8;
                }
                if (modArray[modIndex] == "nr") {
                    finalMult *= 0.8;
                }
                if (modArray[modIndex] == "hd") {
                    finalMult *= 1.02;
                }
                if (modArray[modIndex] == "fl") {
                    finalMult *= 1.1;
                }
                
                finalString += modArray[modIndex].toUpperCase();
            }
            kidscore.scores[k].modMult = finalMult;
            if (finalString == "") kidscore.scores[k].modInfo = "None";
            else kidscore.scores[k].modInfo = finalString.slice(0, finalString.length - 2);
        } else {
            kidscore.scores[k].modMult = 1;
            kidscore.scores[k].modInfo = "";
        }
        kidscore.scores[k].pulse *= kidscore.scores[k].modMult;
        
        let userNames = [];
        for (let m = 0; m < users.length; m++) {
            userNames.push(users[m].username);
        }
        if (!userNames.includes(kidscore.scores[k].username)) {
            users.push({ username: kidscore.scores[k].username, scores: [], pulse: 0 });
        }
        users[users.findIndex(item => item.username === kidscore.scores[k].username)].scores.push(kidscore.scores[k]);
        kidscore.scores.sort(function(a, b){return b.pulse - a.pulse});
    }
}