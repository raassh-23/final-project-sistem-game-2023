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
 * @deprecated
 * @returns {"+" | "-" | "*" | "/"}
 */
function getRandomOperator() {
    const operators = ["+", "-", "*", "/"];
    return operators[getRandomNumber(0, 3)];
}

/**
 *
 * @param {any[]} expressionTokens
 * @param {number} maxMultiplier
 * @param {number} maxAddend
 * @param {number} maxSubtrahend
 * @returns {number} operand
 */
function getOperand(
    operator,
    prevNumber,
    prevNumber2,
    prevOperator,
    maxMultiplier,
    maxAddend,
    maxSubtrahend
) {
    let number = 0;
    switch (operator) {
        case "+":
            number = getRandomNumber(1, maxAddend);
            break;
        case "-":
            number = getRandomNumber(1, maxSubtrahend);
            break;
        case "*":
            // Limit the multiplier based on the previous number
            // to prevent the result from becoming too large
            if (prevNumber > 10) {
                number = getRandomNumber(1, 2);
            } else if (prevNumber > 5) {
                number = getRandomNumber(1, 5);
            } else {
                number = getRandomNumber(1, maxMultiplier);
            }
            break;
        case "/":
            // If the previous operator is ^, prevNumber is the result of the exponent operation
            if (prevOperator === "^") {
                prevNumber = Math.pow(prevNumber2, prevNumber);
            }

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
        case "^":
            // Limit the exponent based on the base number
            // to prevent the result from becoming too large
            let base = prevNumber;
            let upperBound;
            if (base > 5) {
                upperBound = 2;
            } else if (base > 3) {
                upperBound = 3;
            } else {
                upperBound = 5;
            }
            number = getRandomNumber(1, upperBound);
            break;
    }

    return number;
}

/**
 *
 * @param {string[]} operators
 * @param {number[]} operatorLimits
 * @param {number} maxExpBase
 * @param {string[]} expressionTokens
 * @returns {"+" | "-" | "*" | "/" | "^"}
 */
function getOperator(
    operators = ["+", "-", "*", "/", "^"],
    operatorLimits = [-1, -1, 3, 2, 1],
    maxExpBase = 5,
    expressionTokens = []
) {
    // Limit the number of operators used
    // in order to prevent the expression from becoming too complex and large
    let availableOperators = operators.filter(
        (_, index) => operatorLimits[index] !== 0
    );

    // Prevent consecutive use of ^ and / operators and the use of / after a prime number
    // because they can make the expression not interesting, too large, or non-integer
    let prevOperator = expressionTokens[expressionTokens.length - 2] ?? "";
    let prevNumber = expressionTokens[expressionTokens.length - 1];
    if (prevOperator === "^" || prevOperator === "/" || prevNumber > maxExpBase) {
        availableOperators = availableOperators.filter((value, _) => value !== "^");
    }

    if (prevOperator === "/" || isPrime(prevNumber)) {
        availableOperators = availableOperators.filter((value, _) => value !== "/");
    }

    return availableOperators[getRandomNumber(0, availableOperators.length - 1)];
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
    operators = ["+", "-", "*", "/", "^"],
    operatorLimits = [-1, -1, 3, 2, 1],
    maxExpBase = 5,
    maxMultiplier = 10,
    maxAddend = 30,
    maxSubtrahend = 30
) {
    let expressionTokens = [getRandomNumber(1, 20)];

    for (let i = 0; i < operandCount; i++) {
        let operator = getOperator(
            operators,
            operatorLimits,
            maxExpBase,
            expressionTokens
        );
        // Decrement the limit of the operator used
        operatorLimits[operators.indexOf(operator)]--;
        expressionTokens.push(operator);

        // console.log("Exp", expressionTokens.join(' '));
        // console.log("==================================");
        // console.log("available", availableOperators, operatorLimits);
        // console.log("operator", operator);

        const prevNumber = expressionTokens[expressionTokens.length - 2];
        const prevNumber2 = expressionTokens[expressionTokens.length - 4] ?? 1;
        const prevOperator = expressionTokens[expressionTokens.length - 3] ?? "";
        let number = getOperand(
            operator,
            prevNumber,
            prevNumber2,
            prevOperator,
            maxMultiplier,
            maxAddend,
            maxSubtrahend
        );
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
        let closingParenIndex = getRandomNumber(
            openingParenIndex + 2,
            expressionTokens.length - 1
        );
        if (closingParenIndex % 2 === 0) {
            closingParenIndex++;
        }

        // Prevent the parentheses to appear before or after ^ or / operators
        // in order to prevent the expression from becoming too large and non-integer
        let prevOperator = expressionTokens[openingParenIndex - 1] ?? "";
        while (prevOperator === "^" || prevOperator === "/") {
            openingParenIndex -= 2;
            prevOperator = expressionTokens[openingParenIndex - 1] ?? "";
        }

        let nextOperator = expressionTokens[closingParenIndex] ?? "";
        while (nextOperator === "^" || nextOperator === "/") {
            closingParenIndex += 2;
            nextOperator = expressionTokens[closingParenIndex] ?? "";
        }

        expressionTokens.splice(openingParenIndex, 0, "(");
        expressionTokens.splice(closingParenIndex + 1, 0, ")");
    }
    return expressionTokens.join(" ");
}

/**
 * Evaluates an arithmetical expression
 * @param {string} expression The expression to be evaluated
 * @returns {number} The result of the expression
 */
function evaluateExpression(expression) {
    const tokens = expression.split(" ");
    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3,
    };

    const outputQueue = [];
    const operatorStack = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // If the token is a number, add it to the output queue
        if (!isNaN(token)) {
            outputQueue.push(parseFloat(token));
        }

        // If the token is an operator, pop operators from the stack and add them to the output queue
        // until the stack is empty or the top operator has lower precedence than the current operator
        else if (token in precedence) {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== "(" &&
                precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }

        // If the token is a left parenthesis, push it onto the stack
        else if (token === "(") {
            operatorStack.push(token);
        }

        // If the token is a right parenthesis, pop operators from the stack and add them to the output queue
        // until a left parenthesis is found (which is discarded)
        else if (token === ")") {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== "("
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        }
    }

    // Pop any remaining operators from the stack and add them to the output queue
    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    // Evaluate the postfix expression using a stack
    const stack = [];
    for (let i = 0; i < outputQueue.length; i++) {
        const token = outputQueue[i];
        if (!isNaN(token)) {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case "+":
                    stack.push(a + b);
                    break;
                case "-":
                    stack.push(a - b);
                    break;
                case "*":
                    stack.push(a * b);
                    break;
                case "/":
                    stack.push(a / b);
                    break;
                case "^":
                    stack.push(Math.pow(a, b));
                    break;
            }
        }
    }

    return stack.pop();
}

/**
 * Get 3 wrong choices for the question. The first wrong choice is the correct answer +/- tolerance.
 * The second wrong choice is the correct answer of a wrong expression by changing one number.
 * The third wrong choice is the correct answer of a wrong expression by changing one operator.
 * @param {string} expression
 * @param {number} correctAnswer
 * @returns {[number, number, number]} The 3 wrong choices
 */
function getWrongChoices(expression, correctAnswer) {
    const wrongChoices = [];
    const expressionTokens = expression.split(" ");

    // First wrong choice: the correct answer +/- tolerance
    const tolerance = Math.max(1, Math.round(Math.abs(correctAnswer) * 0.1));
    const firstChoice = correctAnswer + getRandomNumber(-tolerance, tolerance);
    wrongChoices.push(firstChoice);

    // Second wrong choice: the correct answer of wrong expression by changing one number
    let wrongExpressionTokens = [...expressionTokens];
    let randomNumberIndex = getRandomNumber(0, wrongExpressionTokens.length - 1);
    while (isNaN(parseInt(wrongExpressionTokens[randomNumberIndex]))) {
        randomNumberIndex = getRandomNumber(0, wrongExpressionTokens.length - 1);
    }
    const oldNumber = parseInt(wrongExpressionTokens[randomNumberIndex]);

    const operator = wrongExpressionTokens[randomNumberIndex - 1] ?? "";
    const nextOperator = wrongExpressionTokens[randomNumberIndex + 1] ?? "";
    let newNumber = oldNumber;

    // If the next operator is division and the previous operator is exponent, change the divident instead of the exponent
    if (operator === "^" && nextOperator === "/") {
        const base = wrongExpressionTokens[randomNumberIndex - 2] ?? 0;
        while (newNumber === 0 || newNumber === oldNumber) {
            const divisor = Math.pow(base, oldNumber);
            randomNumberIndex += 2;
            newNumber = divisor * getRandomNumber(2, 10);
        }

    // If the next operator is division, make sure the new number (the divisor) is divisible by the dividend
    } else if (nextOperator === "/") {
        const dividend = wrongExpressionTokens[randomNumberIndex + 2] ?? 0;
        while (newNumber === 0 || newNumber === oldNumber) {
            newNumber = dividend * getRandomNumber(2, 10);
        }

    // If the number is the first number in the expression or the previous operator is opening parenthesis, change the number by +/- 10
    } else if (operator === "(" || randomNumberIndex === 0) {
        while (newNumber === 0 || newNumber === oldNumber) {
            newNumber = oldNumber + getRandomNumber(-10, 10);
        }
    } else {
        const prevOperator = wrongExpressionTokens[randomNumberIndex - 3] ?? "";
        const prevNumber = wrongExpressionTokens[randomNumberIndex - 2] ?? 0;
        const prevNumber2 = wrongExpressionTokens[randomNumberIndex - 4] ?? 0;

        while (newNumber === 0 ||newNumber === oldNumber) {
            newNumber = getOperand(operator, prevNumber, prevNumber2, prevOperator, 3, 30, 30);
        }
    }
    wrongExpressionTokens[randomNumberIndex] = newNumber;

    console.log("wrong expression number", randomNumberIndex, nextOperator, wrongExpressionTokens.join(" "), wrongExpressionTokens);
    let secondChoice = evaluateExpression(wrongExpressionTokens.join(" "));
    while (secondChoice === correctAnswer || wrongChoices.includes(secondChoice)) {
        secondChoice += getRandomNumber(-2, 2);
    }
    wrongChoices.push(secondChoice);

    // Third wrong choice: the correct answer of wrong expression by changing one operator
    wrongExpressionTokens = [...expressionTokens];
    let randomOperatorIndex = getRandomNumber(0, wrongExpressionTokens.length - 1);
    let oldOperator = wrongExpressionTokens[randomOperatorIndex];
    while (oldOperator === "(" || oldOperator === ")" || oldOperator === "^" || !isNaN(parseInt(oldOperator))) {
        randomOperatorIndex = getRandomNumber(0, wrongExpressionTokens.length - 1);
        oldOperator = wrongExpressionTokens[randomOperatorIndex];
    }

    let newOperator = oldOperator;
    while (newOperator === oldOperator) {
        const availableOperators = ["+", "-", "*"];
        newOperator =
            availableOperators[getRandomNumber(0, availableOperators.length - 1)];
    }
    wrongExpressionTokens[randomOperatorIndex] = newOperator;

    console.log("wrong expression number", randomOperatorIndex, wrongExpressionTokens.join(" "));
    let thirdChoice = evaluateExpression(wrongExpressionTokens.join(" "));
    while (thirdChoice === correctAnswer || wrongChoices.includes(thirdChoice)) {
        thirdChoice += getRandomNumber(-2, 2);
    }
    wrongChoices.push(thirdChoice);

    return wrongChoices;
}

/**
 *
 * @deprecated
 * @returns {[number, "+" | "-" | "*" | "/", number, number]} [firstNumber, operator, secondNumber, thirdNumber]
 */
function getRandomExpression() {
    const operator = getRandomOperator();
    let firstNumber, secondNumber, thirdNumber;

    switch (operator) {
        case "+":
            firstNumber = getRandomNumber(1, 50);
            secondNumber = getRandomNumber(1, 50);
            thirdNumber = firstNumber + secondNumber;
            break;
        case "-":
            firstNumber = getRandomNumber(2, 100);
            secondNumber = getRandomNumber(1, firstNumber - 1);
            thirdNumber = firstNumber - secondNumber;
            break;
        case "*":
            firstNumber = getRandomNumber(1, 10);
            secondNumber = getRandomNumber(1, 10);
            thirdNumber = firstNumber * secondNumber;
            break;
        case "/":
            thirdNumber = getRandomNumber(1, 10);
            secondNumber = getRandomNumber(1, 10);
            firstNumber = thirdNumber * secondNumber;
            break;
    }

    return [firstNumber, operator, secondNumber, thirdNumber];
}

/**
 *
 * @deprecated
 * @param {number} correctAnswer
 * @param {"+" | "-" | "*" | "/"} op
 * @returns {[number, number, number]}
 */
function generateWrongChoices(correctAnswer, op) {
    let tolerance;

    if (op === "+" || op === "-") {
        tolerance = 10;
    } else if (op === "*") {
        tolerance = 25;
    } else {
        tolerance = 5;
    }

    const wrongAnswers = [];

    while (wrongAnswers.length < 3) {
        const wrongAnswer = getRandomNumber(
            correctAnswer - tolerance,
            correctAnswer + tolerance
        );

        if (
            wrongAnswer > 0 &&
            wrongAnswer !== correctAnswer &&
            !wrongAnswers.includes(wrongAnswer)
        ) {
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

        if (
            !positions.some(
                ([px, py]) =>
                    Math.abs(px - x) < choiceDiameter && Math.abs(py - y) < choiceDiameter
            )
        ) {
            positions.push([x, y]);
        }
    }

    return positions;
}
