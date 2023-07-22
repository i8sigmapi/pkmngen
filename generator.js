const genderThreshold = [0, 31, 63, 127, 191, 225, 254, 255];
//100% male, 7:1, 3:1, 1:1, 1:3, 1:7, 100% female, genderless

const natures = [
	["Hardy", "Lonely", "Brave", "Adamant", "Naughty"],
    ["Bold", "Docile", "Relaxed", "Impish", "Lax"],
	["Timid", "Hasty", "Serious", "Jolly", "Naive"],
    ["Modest", "Mild", "Quiet", "Bashful", "Rash"],
    ["Calm", "Gentle", "Sassy", "Careful", "Quirky"],
];
const flavors = ["spicy", "sour", "sweet", "dry", "bitter"];
const stats = ["HP", "Attack", "Defense", "Speed", "Sp. Atk", "Sp. Def"];
const characteristics = [
    ["Loves to eat", "Takes plenty of siestas","Nods off a lot","Scatters things often", "Likes to relax"],
    ["Proud of its power","Likes to thrash about","A little quick tempered","Likes to fight","Quick tempered"],
	["Likes to run","Alert to sounds","Impetuous and silly","Somewhat of a clown","Quick to flee"],
    ["Sturdy body","Capable of taking hits","Highly persistent","Good endurance","Good perseverance"],
    ["Highly curious","Mischievous","Thoroughly cunning ","Often lost in thought","Very finicky"],
    ["Strong willed","Somewhat vain","Strongly defiant","Hates to lose","Somewhat stubborn"],
    ];

let nPlus; //stat boosted by nature
let nMinus; //stat unboosted by nature
let personality = -1; //personality value. set to -1 initially for ease of telling if it's been defined
let natureText;
let flavorText;
let characteristic; //these three just hold some strings when they're decided
let ivs = new Array (); //ivs start undefined
let trainerID = -1;
let secretID = -1; //ids for checking shininess. set to -1 initially for the same reason as personality
let shiny = false; //default to not shiny

let personalityNature = true; //should personality value determine nature?
let shinyRate = 16; //how many out of 65536 should be shiny?
let shinyTries = 3; //how many times should we try to generate a shiny?

function getRndInteger (min, max) {
	return Math.floor (Math.random() * (max - min) ) + min;
}
function getMaxOfArray (numArray) {
	return Math.max.apply(null, numArray);
}
function getPersonality (){
	for (let tries = 0; tries < shinyTries; tries ++){
		personality = getRndInteger(0, Math.pow (2, 32)-1);
		checkShiny ();
		if (shiny == true){
		return
		}
	}
}
function getNature () {
	if (personalityNature == true){
		if (personality <0){
			console.log ("hey dumbass you need a pv before getting a nature");
			return
		}
		nPlus = Math.floor ( ( personality % 25 ) / 5);
		nMinus = personality % 5;
		} else {
			nPlus = getRndInteger (0, 31);
			nMinus = getRndInteger (0, 31);
		}
	if (nPlus == nMinus) {
		natureText = natures [nPlus][nMinus] + ", a neutral nature.";
		flavorText = "Likes all food equally.";
		} else {
	natureText = natures [nPlus][nMinus] + ", increasing " + stats [nPlus + 1] + " and decreasing " + stats [nMinus + 1] +".";
	flavorText = "Likes " + flavors [nPlus] + " food and dislikes " + flavors [nMinus] + " food.";
		}
}
function getIVs () {
	for (let i = 0; i < stats.length; i++){
		ivs.length < stats.length ? ivs.push (getRndInteger (0,31)) : ivs[i] = getRndInteger (0, 31);
	}
}
function getCharacteristic (){
	if (ivs.length < 6){
		console.log ("hey dumbass you need ivs for a characteristic");
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
	} else {console.log ("hey dumbass you forgot to get a pv before your characteristic")}
}

function getTrainerID (){
	trainerID = getRndInteger (0, Math.pow (2, 16) - 1);
}
function getSecretID (){
	secretID = getRndInteger (0, Math.pow (2, 16) - 1);
}
function checkShiny (){
	let error = false;
	if (personality < 0){
		console.log ("personality value missing");
		error = true;
	}
	if (trainerID < 0){
		console.log ("trainer id missing");
		error = true;
	}
	if (secretID < 0){
		console.log ("secret id missing");
		error = true;
	}
	if (error == true){
		return
	}
	shiny = false;
	if (((Math.floor(personality/65536)) ^ (personality % 65536)^ trainerID ^ secretID) < shinyRate){
		shiny = true;
	}
}

getTrainerID ();
getSecretID ();
console.log (trainerID.toString (16) + ", " + secretID.toString (16));
getPersonality ();
console.log (personality.toString (16));
getNature ();
console.log (natureText + "\n" + flavorText);
getIVs ();
getCharacteristic ();
console.log (characteristic + "\n" + ivs);
if (shiny == true){
	console.log ("shiny!");
}