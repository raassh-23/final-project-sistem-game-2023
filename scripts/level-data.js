const currentLevelVariables = {
	"addendRange": [0, 30],
	"subtrahendRange": [0, 30],
	"multiplierRange": [1, 2],
	"maxExpBase": 20,
    "minExponent": 1,
    "parenthesesProbability": 0,
	"operandCount": 2,
	"operators": ['+', '-'],
	"operatorLimits": [-1, -1],
	"countdownSecond": 30
}

let level = 0;

export function getCurrentLevelVariables() {
    let currentLevel = [];

    currentLevel.push(currentLevelVariables["operandCount"]);
    currentLevel.push(currentLevelVariables["operators"]);
    currentLevel.push(currentLevelVariables["operatorLimits"]);
    currentLevel.push(currentLevelVariables["addendRange"]);
    currentLevel.push(currentLevelVariables["subtrahendRange"]);
    currentLevel.push(currentLevelVariables["multiplierRange"]);
    currentLevel.push(currentLevelVariables["maxExpBase"]);
    currentLevel.push(currentLevelVariables["minExponent"]);
    currentLevel.push(currentLevelVariables["parenthesesProbability"]);
	console.log("level", currentLevel)
    return currentLevel;
}

const levelVariables = {
	0 : {
		"maxExpBase": 0,
		"subtrahendRange": [0, 0],
		"multiplierRange": [0, 0],
		"minExponent": 0,
		"parenthesesProbability": 0,

		"operandCount": 2,
		"operators": ['+'],
		"addendRange": [0, 10],
		"operatorLimits": [-1],
		"countdownSecond": 30
	},
	5 : {
		"addendRange": [0, 30],
	},
	// Add '-' operator
	7 : { 
		"operators": ['+', '-'],
		"operatorLimits": [-1, 1],
		"subtrahendRange": [1, 10],
	},
	// Use 3 operands
	9 : { 
		"operandCount": 3,
		"operatorLimits": [-1, 2],
		"subtrahendRange": [1, 30],
	},
	// Add '*' operator
	// Use 2 operands
	13 : { 
		"operandCount": 2,
		"operators": ['+', '-', '*'],
		"operatorLimits": [0, 0, 1],
		"multiplierRange": [1, 5],
	},
	// Add '/' operator
	17 : {
		"operators": ['+', '-', '*', '/'],
		"operatorLimits": [0, 0, 1, 1],
		"multiplierRange": [1, 7],
	},
	// Use 4 operands
	20 : {
		"operatorLimits": [1, 1, 1, 1],
		"operandCount": 3,
	},
	25 : {
		"addendRange": [0, 50],
		"subtrahendRange": [0, 50],
		"operatorLimits": [1, 1, 2, 1],
	},
	27 : {
		"multiplierRange": [1, 10],
		"operatorLimits": [-1, -1, 1, 1],
	},
	// Use parentheses
	30 : {
		"parenthesesProbability": 40,
	},
	// Use 4 operands
	35 : {
		"operandCount": 4,
		"operatorLimits": [-1, -1, 2, 1],
	},
	40 : {
		"addendRange": [0, 70],
		"parenthesesProbability": 65,
	},
	43 : {
		"subtrahendRange": [1, 70],
		"operatorLimits": [1, 1, 2, 2],
	},
	// Use 5 operands
	45 : {
		"operatorLimits": [1, 2, 2, 1],
		"operandCount": 5,
		"parenthesesProbability": 80,
	},
	50 : {
		"operatorLimits": [2, 2, 2, 2],
		"parenthesesProbability": 90,
	},
	// Add '^' operator
	// Use 3 operands
	55 : {
		"operators": ['+', '-', '*', '/', '^'],
		"operatorLimits": [2, 2, 1, 1, 1],
		"operandCount": 3,
		"minExponent": 2,
		"maxExpBase": 2,
		"parenthesesProbability": 50,
	},
	// Use 4 operands
	60 : {
		"operandCount": 4,
		"operatorLimits": [2, 2, 2, 2, 1],
		"parenthesesProbability": 70,
	},
	65 : {
		"minExponent": 3,
		"maxExpBase": 5,
	},
	// Use 5 operands
	70 : {
		"addendRange": [0, 100],
		"operandCount": 5,
	},
	75 : {
		"multiplierRange": [1, 20],
		"operatorLimits": [2, 2, 2, 2, 2],
		"parenthesesProbability": 80,
	},
	80 : {
		"subtrahendRange": [1, 100],
		"maxExpBase": 7,
	},
	85 : {
		"addendRange": [0, 200],
		"operatorLimits": [2, 2, 3, 2, 2],
	},
	90 : {
		"multiplierRange": [1, 30],
		"operatorLimits": [3, 3, 3, 2, 3],
	},
	// Use 6 operands
	95 : {
		"operandCount": 6,
		"operatorLimits": [3, 3, 3, 2, 2],
	},
	100 : {
		"subtrahendRange": [1, 250],
		"operatorLimits": [3, 3, 3, 3, 3],
	},
	// Use 7 operands
	120 : {
		"operandCount": 7,
		"operatorLimits": [4, 3, 4, 3, 3],
	},
	// Use 8 operands
	150 : {
		"operandCount": 8,
		"operatorLimits": [5, 4, 4, 4, 3],
		"parenthesesProbability": 90,
	},
}

export function updateLevelVariables() {
	let newLevelVariables = levelVariables[level] ?? null;
	// for (const levelVariable in levelVariables) {
	// 	if (level == levelVariable) {
	// 		newLevelVariables = levelVariables[levelVariable];
	// 	}
	// }

	if (newLevelVariables) {
		console.log("update", level, newLevelVariables);
		for (const variable in newLevelVariables) {
			currentLevelVariables[variable] = newLevelVariables[variable];
		}
	}

	console.log("currentLevelVariables", level, currentLevelVariables);

	level++;
}