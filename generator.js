const genderThreshold = [0, 31, 63, 127, 191, 225, 254, 255];
//100% male, 7:1, 3:1, 1:1, 1:3, 1:7, 100% female, genderless. might move this to a module later

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
let personality2 = -1; //holds a 32 bit integer for calculating hidden ability status, nature, and ivs
let natureText;
let flavorText;
let characteristic; //these three just hold some strings when they're decided
let ivs = new Array (); //ivs start undefined
let trainerID = -1;
let secretID = -1; //ids for checking shininess. set to -1 initially for the same reason as personality
let shiny = false; //default to not shiny
let abilitySlot = 0; //default to first ability

//settings
let shinyRate = 16; //how many out of 65536 should be shiny?
let shinyTries = 1; //how many tries for a shiny?
let hiddenRate = 64; //how many first ability pokemon out of 65536 should be changed to hidden ability?
let hiddenTries = 3; //how many tries for a hidden ability?

function getRndInteger (min, max) {
	return Math.floor (Math.random() * (max - min) ) + min;
}
function getMaxOfArray (numArray) {
	return Math.max.apply(null, numArray);
}
function checkShiny (pv = personality){
	let error = false;
	if (pv == undefined){
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
	if (((Math.floor(pv/65536)) ^ (pv % 65536) ^ trainerID ^ secretID) < shinyRate){
		return true;
	}
}
function checkAbility (pv2 = personality2, pv = personality){
	let error = false;
	if (pv < 0){
		console.log ("personality value missing");
		error = true;
	}
	if (pv2 < 0){
		console.log ("personality value 2 missing");
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
	let slot = Math.floor(pv/65536) % 2;
	if (slot == 0){
		if ((Math.floor (pv2/65536) ^ pv2 % 65536 ^ trainerID ^ secretID) < hiddenRate){
			slot = 2;
			}
	}
	return slot;
	
}
function getPersonality (){
	if (shinyTries < 1 || isNaN(shinyTries)){
		shinyTries = 1;
	}
	if (shinyTries > 255){
		shinyTries = 255;
	}
	shiny = false;
	let checking;
	for (let tries = 0; tries < Math.floor(shinyTries); tries ++){
		checking = getRndInteger(0, Math.pow (2, 32)-1);
		if (checkShiny (checking)){
			personality = checking;
			shiny = true
			return
		} else if (tries + 1 == Math.floor (shinyTries)){
			personality = checking;
		}
	}
}
function getPersonality2 (){
	if (hiddenTries < 1 || isNaN(hiddenTries)){
		hiddenTries = 1;
	}
	if (hiddenTries > 255){
		hiddenTries = 255;
	}
	let checking;
	let currentAbility;
	for (let tries = 0; tries < Math.floor(hiddenTries); tries ++){
		checking = getRndInteger(0, Math.pow (2, 32)-1);
		currentAbility = (checkAbility (checking));
		if (currentAbility == 2 || tries + 1 == Math.floor(hiddenTries)){
			personality2 = checking;
			abilitySlot = currentAbility;
			return
		}
	}
}
function getNature () {
	if (personality2 == undefined
	|| personality2 < 0
	|| isNaN (personality2)){
		console.log ("hey dumbass you need a valid pv2 before getting a nature");
		return
	}
	nPlus = Math.floor ( ( (personality2/65536) % 25 ) / 5);
	nMinus = Math.floor (personality2/65536) % 5;
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
	let error = false;
	if (ivs == undefined){
		console.log ("hey dumbass you need ivs for a characteristic");
		error = true;
	}
	if (personality == undefined){
		console.log ("hey dumbass you forgot to get a pv before your characteristic");
		error = true;
	}
	
	let maxValue = getMaxOfArray(ivs);
	let check = personality % 6;
	while (ivs[check] < maxValue){
		if (check == 5){
			check = 0;
		} else {check +=1;}
	}
	let charVers = maxValue % 5;
	characteristic = characteristics[check][charVers];
}
function getTrainerID (){
	trainerID = getRndInteger (0, Math.pow (2, 16) - 1);
}
function getSecretID (){
	secretID = getRndInteger (0, Math.pow (2, 16) - 1);
}

getTrainerID ();
getSecretID ();
console.log (trainerID.toString (16) + ", " + secretID.toString (16));
getPersonality ();
getPersonality2 ();
console.log (personality.toString (16) + " " + personality2.toString (16));
getNature ();
console.log (natureText + "\n" + flavorText);
getIVs ();
getCharacteristic ();
console.log (characteristic + "\n" + ivs);
if (shiny == true){
	console.log ("shiny!");
}
console.log ("ability number " + abilitySlot);