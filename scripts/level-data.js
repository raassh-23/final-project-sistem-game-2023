import { level, currentLevelVariables } from "./for-events.js";

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
	// Add 'x' operator
	// Use 2 operands
	13 : { 
		"operators": ['x', '-', 'x'],
		"operatorLimits": [0, 0, 1],
		"multiplierRange": [1, 5],
	},
	// Add '/' operator
	17 : {
		"operators": ['+', '-', 'x', '/'],
		"operatorLimits": [0, 0, 1, 1],
		"multiplierRange": [1, 7],
	},
	// Use 3 operands
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
		"parenthesesProbability": 65,
	},
	43 : {
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
		"operators": ['+', '-', 'x', '/', '^'],
		"operatorLimits": [2, 2, 2, 2, 1],
		"operandCount": 3,
		"minExponent": 2,
		"maxExpBase": 5,
		"parenthesesProbability": 50,
	},
}

export function updateLevelVariables() {
	let newLevelVariables;
	for (const levelVariable in levelVariables) {
		if (level === levelVariable) {
			newLevelVariables = levelVariables[levelVariable];
		}
	}

	if (newLevelVariables) {
		for (const variable in newLevelVariables) {
			currentLevelVariables[variable] = newLevelVariables[variable];
		}
	}
}