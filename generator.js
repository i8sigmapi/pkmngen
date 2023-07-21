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
const stats = ["Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];

let nPlus;
let nMinus;
let personality;
let natureText;

function getRndInteger (min, max) {
	return Math.floor (Math.random() * (max - min) ) + min;
}
function getPersonality (){
	personality = getRndInteger(0, Math.pow (2, 32)-1);
};
function getNature () {
	nPlus = getRndInteger (0, 5);
	nMinus = getRndInteger (0, 5);
	if (nPlus == nMinus) {natureText = natures [nPlus][nMinus] + ", a neutral nature"}
	else {natureText = natures [nPlus][nMinus] + ", increasing " + stats [nPlus] + " and decreasing " + stats [nMinus]}
}
getPersonality ();
console.log (personality.toString (2));
getNature ();
console.log (natureText);