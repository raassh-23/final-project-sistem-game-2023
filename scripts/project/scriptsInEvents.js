/**
 * 
 * @param {number} length 
 * @returns {string} random string with length
 */
function generateRandomName(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    while (text.length < length) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} random number between min and max (inclusive)
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 
 * @returns {"+" | "-" | "*" | "/"}
 */
function getRandomOperator() {
    const operators = ['+', '-', '*', '/'];
    return operators[getRandomNumber(0, 3)];
}

/**
 * 
 * @returns {[number, "+" | "-" | "*" | "/", number, number]} [firstNumber, operator, secondNumber, thirdNumber]
 */
function getRandomExpression() {
    const operator = getRandomOperator();
    let firstNumber, secondNumber, thirdNumber;

    switch (operator) {
        case '+':
            firstNumber = getRandomNumber(1, 50);
            secondNumber = getRandomNumber(1, 50);
            thirdNumber = firstNumber + secondNumber;
            break;
        case '-':
            firstNumber = getRandomNumber(2, 100);
            secondNumber = getRandomNumber(1, firstNumber - 1);
            thirdNumber = firstNumber - secondNumber;
            break;
        case '*':
            firstNumber = getRandomNumber(1, 10);
            secondNumber = getRandomNumber(1, 10);
            thirdNumber = firstNumber * secondNumber;
            break;
        case '/':
            thirdNumber = getRandomNumber(1, 10);
            secondNumber = getRandomNumber(1, 10);
            firstNumber = thirdNumber * secondNumber;
            break;
    }

    return [firstNumber, operator, secondNumber, thirdNumber];
}

/**
 * 
 * @param {number} correctAnswer 
 * @param {"+" | "-" | "*" | "/"} op 
 * @returns {[number, number, number]}
 */
function generateWrongChoices(correctAnswer, op) {
    let tolerance;

    if (op === '+' || op === '-') {
        tolerance = 10;
    } else if (op === '*') {
        tolerance = 25;
    } else {
        tolerance = 5;
    }

    const wrongAnswers = [];

    while (wrongAnswers.length < 3) {
        const wrongAnswer = getRandomNumber(correctAnswer - tolerance, correctAnswer + tolerance);

        if (wrongAnswer > 0 && wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer)) {
            wrongAnswers.push(wrongAnswer);
        }
    }

    return wrongAnswers;
}

/**
 * 
 * @returns {[string, number, [number, number, number, number]]} [question, correctAnswer, choices]
 */
function generateQuestion() {
    const [a, op, b, c] = getRandomExpression();
    const format = getRandomNumber(1, 3);

    let question, correctAnswer;

    switch (format) {
        case 1:
            question = `${a} ${op} ${b} = ?`;
            correctAnswer = c;
            break;
        case 2:
            question = `${a} ${op} ? = ${c}`;
            correctAnswer = b;
            break;
        case 3:
            question = `? ${op} ${b} = ${c}`;
            correctAnswer = a;
            break;
    }

    const choices = generateWrongChoices(correctAnswer, op);
    const randomIndex = getRandomNumber(0, 3);
    choices.splice(randomIndex, 0, correctAnswer);

    return [question, correctAnswer, choices];
}

/**
 * 
 * @param {number} layoutWidth 
 * @param {number} layoutHeight 
 * @param {number} choiceDiameter 
 * @returns {[number, number][]}
 */
function generateChoicePositions(layoutWidth, layoutHeight, choiceDiameter) {
    const positions = [];
    const radius = choiceDiameter / 2;

    while (positions.length < 4) {
        const x = getRandomNumber(radius, layoutWidth - radius);
        const y = getRandomNumber(radius, layoutHeight - radius);

        if (!positions.some(([px, py]) => Math.abs(px - x) < choiceDiameter && Math.abs(py - y) < choiceDiameter)) {
            positions.push([x, y]);
        }
    }

    return positions;
}



const scriptsInEvents = {

	async Utilites_es_Event1_Act1(runtime, localVars)
	{
		runtime.setReturnValue(generateRandomName(localVars.length))
	},

	async Utilites_es_Event18_Act1(runtime, localVars)
	{
		const [question, correct, choices] = generateQuestion();
		
		const {width, height} = runtime.layout;
		
		const choicePositions = generateChoicePositions(width, height, 512);
		
		runtime.globalVars.question = question;
		runtime.globalVars.correctAnswer = correct;
		runtime.globalVars.choices = choices.join(",");
		runtime.globalVars.choicesPosition = choicePositions
			.map(([x, y]) => `${x}:${y}`)
			.join(",");
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

