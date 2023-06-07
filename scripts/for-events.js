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

function clampNumber(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

/**
 * 
 * @param {number} number 
 * @returns {boolean} true if number is prime
 */
function isPrime(number) {
    if (number <= 3) {
        return true;
    }

    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return false;
        }
    }

    return true;
}

/**
 * Generate a simple arithmetic expression
 * @param {number} operandCount The number of operands in the expression
 * @param {string[]} operators The operators used in the expression
 * @param {number[]} operatorLimits The maximum number of times each operator can be used
 * @param {number} maxExpBase The maximum base number for the exponent operator
 * @param {number} maxMultiplier The maximum multiplier for the multiplication operator
 * @returns {string} complex arithmetic expression
 */
function getComplexArithmeticExpression(
    operandCount = 2, 
    operators = ['+', '-', '*', '/', '^'],
    operatorLimits = [-1, -1, 3, 2, 1],
    maxExpBase = 5,
    maxMultiplier = 10,) {

    let expressionTokens = [getRandomNumber(1, 20)];

    for (let i = 0; i < operandCount; i++) {
        // Limit the number of operators used 
        // in order to prevent the expression from becoming too complex and large
        let availableOperators = operators.filter((_, index) => operatorLimits[index] !== 0);

        // Prevent consecutive use of ^ and / operators and the use of / after a prime number
        // because they can make the expression not ineteresting, too large, or irrational
        const prevOperator = expressionTokens[expressionTokens.length - 2] ?? '';
        let prevNumber = expressionTokens[expressionTokens.length - 1];
        if (prevOperator === '^' || prevNumber > maxExpBase) {
            availableOperators = availableOperators.filter((value, _) => value !== '^');
        } 
        
        if (prevOperator === '/' || isPrime(prevNumber)) {
            availableOperators = availableOperators.filter((value, _) => value !== '/');
        }

        let operator = availableOperators[getRandomNumber(0, availableOperators.length - 1)];
        
        // console.log("Exp", expressionTokens.join(' '));
        // console.log("==================================");
        // console.log("available", availableOperators, operatorLimits);
        // console.log("operator", operator);
            

        // Decrement the limit of the operator used
        operatorLimits[operators.indexOf(operator)]--;

        expressionTokens.push(operator);

        let number = 0;
        prevNumber = expressionTokens[expressionTokens.length - 2];
        switch (operator) {
            case '+':
                number = getRandomNumber(1, 50);
                break;
            case '-':
                number = getRandomNumber(1, 50);
                break;
            case '*':
                // Limit the multiplier based on the previous number
                // to prevent the result from becoming too large
                if (prevNumber > 10) {
                    number = getRandomNumber(1, 3);
                } else if (prevNumber > 5) {
                    number = getRandomNumber(1, 5);
                } else {
                    number = getRandomNumber(1, maxMultiplier);
                }
                break;
            case '/':
                // Make sure the result is an integer 
                // by making the divisor a factor of the dividend
                const factors = [];
                for (let i = 1; i <= prevNumber; i++) {
                    if (prevNumber % i === 0 && i !== 1 && i !== prevNumber) {
                        factors.push(i);
                    }
                }
                number = factors[getRandomNumber(0, factors.length - 1)];
                break;
            case '^':
                // Limit the exponent based on the base number 
                // to prevent the result from becoming too large
                let base = expressionTokens[expressionTokens.length - 2];
                let upperBound;
                if (base > 10) {
                    upperBound = 2;
                } else if (base > 5) {
                    upperBound = 3;
                } else {
                    upperBound = 5;
                }
                number = getRandomNumber(1, upperBound);
                break;
        }

        expressionTokens.push(number);
    }

    // Add parentheses to the expression
    if (getRandomNumber(0, 1) === 0 && expressionTokens.length >= 5) {

        // Find a random index to open the parentheses
        // and make sure the opening parentheses appear before a number
        let openingIndexUpperBound = expressionTokens.length - 2 - 1;
        let openingParenIndex = getRandomNumber(0, openingIndexUpperBound);
        if (openingParenIndex % 2 !== 0) {
            openingParenIndex--;
        }

        // Find a random index to close the parentheses
        // and make sure the closing parentheses appear after a number
        let closingParenIndex = getRandomNumber(openingParenIndex + 2, expressionTokens.length - 1);
        if (closingParenIndex % 2 === 0) {
            closingParenIndex++;
        }

        // Prevent the parentheses to appear before or after ^ or / operators
        // in order to prevent the expression from becoming too large and irrational
        let prevOperator = expressionTokens[openingParenIndex - 1] ?? '';
        while (prevOperator === '^' || prevOperator === '/') {
            openingParenIndex -= 2;
            prevOperator = expressionTokens[openingParenIndex - 1] ?? '';
        }

        let nextOperator = expressionTokens[closingParenIndex] ?? '';
        while (nextOperator === '^' || nextOperator === '/') {
            closingParenIndex += 2;
            nextOperator = expressionTokens[closingParenIndex] ?? '';
        }

        expressionTokens.splice(openingParenIndex, 0, '(');
        expressionTokens.splice(closingParenIndex + 1, 0, ')');
    }
    return expressionTokens.join(' ');
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
