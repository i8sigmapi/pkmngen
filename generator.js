const genderThreshold = [0, 31, 63, 127, 191, 225, 254, 255];
//100% male, 7:1, 3:1, 1:1, 1:3, 1:7, 100% female, genderless

const natures = [
	["Hardy", "Lonely", "Adamant", "Naughty", "Brave"],
    ["Bold", "Docile", "Impish", "Lax", "Relaxed"],
    ["Modest", "Mild", "Bashful", "Rash", "Quiet"],
    ["Calm", "Gentle", "Careful", "Quirky", "Sassy"],
    ["Timid", "Hasty", "Jolly", "Naive", "Serious"]
];
const flavors = ["spicy", "sour", "dry", "bitter", "sweet"];
const stats = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
const characteristics = [
    ["It loves to eat", "It takes plenty of siestas","It nods off a lot","It scatters things often", "It likes to relax"],
    ["It's proud of its power","It likes to thrash about","It's a little quick tempered","It likes to fight","It's quick tempered"],
    ["It has a sturdy body","It's capable of taking hits","It's highly persistent","It has good endurance","It has good perseverance"],
    ["It's highly curious","It's mischievous","It's thoroughly cunning ","It's often lost in thought","It's very finicky"],
    ["It's strong willed","It's somewhat vain","It's strongly defiant","It hates to lose","It's somewhat stubborn "],
    ["It likes to run","It's alert to sounds","It's impetuous and silly","It's somewhat of a clown","It's quick to flee"]
    ];

let nPlus;
let nMinus;
let personality = -1;
let natureText;
let flavorText;
let characteristic;
let ivs = new Array ();
let trainerID;
let secretID;

function getRndInteger (min, max) {
	return Math.floor (Math.random() * (max - min) ) + min;
}
function getMaxOfArray (numArray) {
	return Math.max.apply(null, numArray);
}
function getPersonality (){
	personality = getRndInteger(0, Math.pow (2, 32)-1);
}
function getNature () {
	nPlus = getRndInteger (0, 5);
	nMinus = getRndInteger (0, 5);
	if (nPlus == nMinus) {
		natureText = "It's " + natures [nPlus][nMinus] + ", a neutral nature.";
		flavorText = "It likes all food equally.";
		}
	else {
		natureText = "It's " + natures [nPlus][nMinus] + ", increasing " + stats [nPlus + 1] + " and decreasing " + stats [nMinus + 1] +".";
		flavorText = "It likes " + flavors [nPlus] + " food and dislikes " + flavors [nMinus] + " food.";
	}
}
function getIVs () {
	for (let i = 0; i < stats.length; i++){
		ivs.length < stats.length ? ivs.push (getRndInteger (0,31)) : ivs[i] = getRndInteger (0, 31);
	}
    let maxValue = getMaxOfArray(ivs);
	if (personality >= 0) {
		let check = personality % 6;
		while (ivs[check] < maxValue){
			if (check === 5)
			{check = 0;}
			else {check +=1;}
		}
		var charVers = maxValue % 5;
	characteristic = characteristics[check][charVers];
	} else {console.log ("hey dumbass you forgot to get a pv first")}
}

getPersonality ();
console.log (personality.toString (2));
getNature ();
console.log (natureText + "\n" + flavorText);
getIVs ();
console.log (characteristic + "\n" + ivs);