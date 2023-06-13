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
	"countdownRange": [10, 30]
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
		"addendRange": [1, 10],
		"operatorLimits": [-1],
		"countdownRange": [10, 30]
	},
	5 : {
		"addendRange": [5, 30],
		"countdownRange": [5, 25]
	},
	// Add '-' operator
	7 : { 
		"operators": ['+', '-'],
		"operatorLimits": [-1, 1],
		"subtrahendRange": [1, 10],
		"countdownRange": [10, 25]
	},
	// Use 3 operands
	9 : { 
		"operandCount": 3,
		"operatorLimits": [-1, 2],
		"subtrahendRange": [5, 30],
		"countdownRange": [5, 25]
	},
	// Add '*' operator
	// Use 2 operands
	13 : { 
		"operandCount": 2,
		"operators": ['+', '-', '*'],
		"operatorLimits": [0, 0, 1],
		"multiplierRange": [1, 5],
		"countdownRange": [10, 20]
	},
	// Add '/' operator
	17 : {
		"operators": ['+', '-', '*', '/'],
		"operatorLimits": [0, 0, 1, 1],
		"multiplierRange": [1, 7],
		"countdownRange": [5, 30]
	},
	// Use 4 operands
	20 : {
		"operatorLimits": [1, 1, 1, 1],
		"operandCount": 3,
		"countdownRange": [5, 30]
	},
	25 : {
		"addendRange": [15, 50],
		"subtrahendRange": [10, 50],
		"operatorLimits": [1, 1, 2, 1],
		"countdownRange": [10, 18]
	},
	27 : {
		"multiplierRange": [1, 10],
		"operatorLimits": [-1, -1, 1, 1],
		"countdownRange": [5, 20]
	},
	// Use parentheses
	30 : {
		"parenthesesProbability": 40,
		"countdownRange": [5, 25]
	},
	// Use 4 operands
	35 : {
		"operandCount": 4,
		"operatorLimits": [-1, -1, 2, 1],
		"countdownRange": [5, 35]
	},
	40 : {
		"addendRange": [20, 70],
		"parenthesesProbability": 65,
		"countdownRange": [5, 30]
	},
	43 : {
		"subtrahendRange": [20, 70],
		"operatorLimits": [1, 1, 2, 2],
		"countdownRange": [5, 22]
	},
	// Use 5 operands
	45 : {
		"operatorLimits": [1, 2, 2, 1],
		"operandCount": 5,
		"parenthesesProbability": 80,
		"countdownRange": [5, 30]
	},
	50 : {
		"operatorLimits": [2, 2, 2, 2],
		"parenthesesProbability": 90,
		"countdownRange": [5, 27]
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
		"countdownRange": [10, 35]
	},
	// Use 4 operands
	60 : {
		"operandCount": 4,
		"operatorLimits": [2, 2, 2, 2, 1],
		"parenthesesProbability": 70,
		"countdownRange": [5, 25]
	},
	65 : {
		"minExponent": 3,
		"maxExpBase": 5,
		"countdownRange": [5, 27]
	},
	// Use 5 operands
	70 : {
		"addendRange": [40, 100],
		"operandCount": 5,
		"countdownRange": [5, 30]
	},
	75 : {
		"multiplierRange": [1, 20],
		"operatorLimits": [2, 2, 2, 2, 2],
		"parenthesesProbability": 80,
		"countdownRange": [5, 28]
	},
	80 : {
		"subtrahendRange": [35, 100],
		"maxExpBase": 7,
		"countdownRange": [10, 30]
	},
	85 : {
		"addendRange": [75, 200],
		"operatorLimits": [2, 2, 3, 2, 2],
		"countdownRange": [10, 35]
	},
	90 : {
		"multiplierRange": [1, 30],
		"operatorLimits": [3, 3, 3, 2, 3],
		"countdownRange": [5, 35]
	},
	// Use 6 operands
	95 : {
		"operandCount": 6,
		"operatorLimits": [3, 3, 3, 2, 2],
		"countdownRange": [1, 45]
	},
	100 : {
		"subtrahendRange": [85, 250],
		"operatorLimits": [3, 3, 3, 3, 3],
		"countdownRange": [20, 50]
	},
	// Use 7 operands
	120 : {
		"operandCount": 7,
		"operatorLimits": [4, 3, 4, 3, 3],
		"countdownRange": [20, 70]
	},
	// Use 8 operands
	150 : {
		"operandCount": 8,
		"operatorLimits": [5, 4, 4, 4, 3],
		"parenthesesProbability": 90,
		"countdownRange": [25, 100]
	},
}

export function reset() {
	level = 0;
}

function updateCountdownRange(runtime) {
	const newCountdownRange = currentLevelVariables["countdownRange"];
	runtime.globalVars.MIN_COUNTDOWN_DURATION = newCountdownRange[0];
	runtime.globalVars.MAX_COUNTDOWN_DURATION = newCountdownRange[1];
}

export function updateLevelVariables(runtime) {
	let newLevelVariables = levelVariables[level] ?? null;
	// for (const levelVariable in levelVariables) {
	// 	if (level == levelVariable) {
	// 		newLevelVariables = levelVariables[levelVariable];
	// 	}
	// }

	if (newLevelVariables) {
		console.log("update", level, newLevelVariables);
		runtime.globalVars.countdownMultiplier = 0;
		for (const variable in newLevelVariables) {
			currentLevelVariables[variable] = newLevelVariables[variable];
		}
	}

	console.log("currentLevelVariables", level, currentLevelVariables);

	updateCountdownRange(runtime);
	runtime.globalVars.countdownMultiplier++;
	level++;
}