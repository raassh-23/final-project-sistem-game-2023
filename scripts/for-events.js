import { updateLevelVariables, getCurrentLevelVariables, reset } from "./level-data.js";

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
 * @param {string} operator
 * @param {number} prevNumber
 * @param {number} prevNumber2
 * @param {string} prevOperator
 * @param {number[]} multiplierRange
 * @param {number[]} addendRange
 * @param {number[]} subtrahendRange
 * @param {number} minExponent
 * @returns {string} operand
 */
function getOperand(
    operator,
    prevNumber,
    prevNumber2,
    prevOperator,
    multiplierRange,
    addendRange,
    subtrahendRange,
    minExponent,
) {
    let number = 0;
    switch (operator) {
        case "+":
            number = getRandomNumber(...addendRange);
            break;
        case "-":
            number = getRandomNumber(...subtrahendRange);
            break;
        case "*":
            // Limit the multiplier based on the previous number
            // to prevent the result from becoming too large
            if (prevNumber > 10) {
                number = getRandomNumber(1, 2);
            } else if (prevNumber > 5) {
                number = getRandomNumber(1, 5);
            } else {
                number = getRandomNumber(...multiplierRange);
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
                if (isPrime(prevNumber)) {
                    factors.push(prevNumber);
                    factors.push(1);
                    break;
                }

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
            number = getRandomNumber(minExponent, upperBound);
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
    console.log("getOperator", operators, operatorLimits);
    let availableOperators = operators.filter(
        (_, index) => operatorLimits[index] != 0
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
    console.log("getOperator", availableOperators);

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
 * @param {number[]} operatorLimitsParam The maximum number of times each operator can be used
 * @param {number} maxExpBase The maximum base number for the exponent operator
 * @param {[number, number]} multiplierRange The multiplier range for the multiplication operator
 * @param {[number, number]} addendRange The addend range for the addition operator
 * @param {[number, number]} subtrahendRange The subtrahend range for the subtraction operator
 * @param {number} minExponent The minimum exponent for the exponent operator
 * @param {number} parenthesesProbability The probability of adding parentheses to the expression
 * @returns {string[]} The expression tokens
 */
function getComplexArithmeticExpression(
    operandCount = 2,
    operators = ["+"],
    operatorLimitsParam = [-1],
    addendRange = [1, 5],
    subtrahendRange = [1, 5],
    multiplierRange = [0, 0],
    maxExpBase = 0,
    minExponent = 0,
    parenthesesProbability = 0,
) {
    let expressionTokens = [getRandomNumber(...addendRange)];

    // make copies of objects in the parameter to prevent the orignal being modified
    let operatorLimits = [...operatorLimitsParam];

    for (let i = 0; i < operandCount - 1; i++) {
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
            multiplierRange,
            addendRange,
            subtrahendRange,
            minExponent
        );
        expressionTokens.push(number);
    }

    // Add parentheses to the expression
    if (getRandomNumber(0, 100) < parenthesesProbability && expressionTokens.length >= 5) {
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
    return expressionTokens;
}

/**
 * Evaluates an arithmetical expression
 * @param {string[]} expressionTokens The expression to be evaluated
 * @returns {number} The result of the expression
 */
function evaluateExpression(expressionTokens) {
    const tokens = expressionTokens;
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
 * @param {string[]} expressionTokens The tokens of the expression
 * @param {number} correctAnswer The correct answer
 * @returns {[number, number, number]} The 3 wrong choices
 */
function getWrongChoices(expressionTokens, correctAnswer) {
    const wrongChoices = [];
    console.log("expressionTokens: " + expressionTokens);

    // First wrong choice: the correct answer +/- tolerance
    const tolerance = Math.max(1, Math.round(Math.abs(correctAnswer) * 0.1));
    let firstChoice = correctAnswer + getRandomNumber(-tolerance, tolerance);
    while (firstChoice === correctAnswer) {
        firstChoice = correctAnswer + getRandomNumber(-tolerance, tolerance);
    }
    wrongChoices.push(firstChoice);
    console.log("First choice: " + firstChoice);

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
    console.log("Old number: " + oldNumber);

    let tries = 0;

    // If the next operator is division and the previous operator is exponent, change the divident instead of the exponent
    if (operator === "^" && nextOperator === "/") {
        const base = wrongExpressionTokens[randomNumberIndex - 2] ?? 0;
        while (newNumber === 0 || newNumber === oldNumber) {
            const divisor = Math.pow(base, oldNumber);
            randomNumberIndex += 2;
            newNumber = divisor * getRandomNumber(2, 10);
            
            tries++;
            if (tries > 100) {
                newNumber = oldNumber + getRandomNumber(-10, 10);
                break;
            }
        }

    // If the next operator is division, make sure the new number (the divisor) is divisible by the dividend
    } else if (nextOperator === "/") {
        const dividend = wrongExpressionTokens[randomNumberIndex + 2] ?? 0;
        while (newNumber === 0 || newNumber === oldNumber) {
            newNumber = dividend * getRandomNumber(2, 10);
            tries++;
            if (tries > 100) {
                newNumber = oldNumber + getRandomNumber(-10, 10);
                break;
            }
        }

    // If the number is the first number in the expression or the previous operator is opening parenthesis, change the number by +/- 10
    } else if (operator === "(" || randomNumberIndex === 0) {
        while (newNumber === 0 || newNumber === oldNumber) {
            newNumber = oldNumber + getRandomNumber(-10, 10);
            tries++;
            if (tries > 100) {
                newNumber = oldNumber + getRandomNumber(-10, 10);
                break;
            }
        }
    } else {
        const prevOperator = wrongExpressionTokens[randomNumberIndex - 3] ?? "";
        const prevNumber = wrongExpressionTokens[randomNumberIndex - 2] ?? 0;
        const prevNumber2 = wrongExpressionTokens[randomNumberIndex - 4] ?? 0;
        
        while (newNumber === 0 ||newNumber === oldNumber) {
            newNumber = getOperand(operator, prevNumber, prevNumber2, prevOperator, [0, 3], [0, 30], [0, 30], 2);
            tries++;
            if (tries > 100) {
                newNumber = oldNumber + getRandomNumber(-10, 10);
                break;
            }
        }
    }
    wrongExpressionTokens[randomNumberIndex] = newNumber;

    console.log("wrong expression number", randomNumberIndex, nextOperator, wrongExpressionTokens.join(" "), wrongExpressionTokens);
    let secondChoice = evaluateExpression(wrongExpressionTokens);
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
    let thirdChoice = evaluateExpression(wrongExpressionTokens);
    while (thirdChoice === correctAnswer || wrongChoices.includes(thirdChoice)) {
        thirdChoice += getRandomNumber(-2, 2);
    }
    wrongChoices.push(thirdChoice);

    console.log("choices", wrongChoices.join(" "), correctAnswer);

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
    // const [a, op, b, c] = getRandomExpression();
    // const format = getRandomNumber(1, 3);
    const expressionTokens = getComplexArithmeticExpression(...getCurrentLevelVariables());
    console.log("expression tokens", expressionTokens)
    const correctAnswer = evaluateExpression([...expressionTokens]);
    console.log("correct answer", correctAnswer)
    let choices = getWrongChoices([...expressionTokens], correctAnswer);
    console.log("choices", choices);
    
    let question = expressionTokens.join(" ") + " = ?";
    question = question.replace("( ", "(");
    question = question.replace(" )", ")");

    // replace "^ number" with that number in superscript
    question = question.replace(/\^ \d+/g, (match) => {
        const number = match.split(" ")[1];
        return `<sup>${number}</sup>`;
    });

    // let question, correctAnswer;

    // switch (format) {
    //     case 1:
    //         question = `${a} ${op} ${b} = ?`;
    //         correctAnswer = c;
    //         break;
    //     case 2:
    //         question = `${a} ${op} ? = ${c}`;
    //         correctAnswer = b;
    //         break;
    //     case 3:
    //         question = `? ${op} ${b} = ${c}`;
    //         correctAnswer = a;
    //         break;
    // }

    // const choices = generateWrongChoices(correctAnswer, op);
    const randomIndex = getRandomNumber(0, 3);
    choices.splice(randomIndex, 0, correctAnswer);
    console.log("question", question, correctAnswer, choices)
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

/**
 * Converts an HSL color value to RGB.
 * @param {number} hue - The hue value (0-360)
 * @param {number} saturation - The saturation value (0-100)
 * @param {number} luminosity - The luminosity value (0-100)
 * @returns {[number, number, number]} The RGB value as an array of [r, g, b] values (0-255)
 */
function hslToRgb(hue, saturation, luminosity) {
  // Convert hue, saturation, and luminosity values to the range 0-1
  console.log("hsl", hue, saturation, luminosity);
  hue = hue % 360;
  hue /= 360;
  saturation /= 100;
  luminosity /= 100;
  console.log("hsl'", hue, saturation, luminosity);

  // Calculate the chroma
  const chroma = (1 - Math.abs(2 * luminosity - 1)) * saturation;

  // Calculate the hue' value
  const huePrime = hue * 6;

  // Calculate the second largest component of the color
  const secondLargestComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));

  // Calculate the lightness adjustment
  const lightnessAdjustment = luminosity - chroma / 2;

  // Calculate the RGB values
  let red, green, blue;
  
  red = Math.max(510*Math.abs(Math.cos(hue))-255, 0);
  green = Math.max(510*Math.abs(Math.cos(hue + 120))-255, 0);
  blue = Math.max(510*Math.abs(Math.cos(hue + 240))-255, 0);
  console.log("rgb", red, green, blue);
  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = secondLargestComponent;
    blue = 0;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = secondLargestComponent;
    green = chroma;
    blue = 0;
  } else if (huePrime >= 2 && huePrime < 3) {
    red = 0;
    green = chroma;
    blue = secondLargestComponent;
  } else if (huePrime >= 3 && huePrime < 4) {
    red = 0;
    green = secondLargestComponent;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = secondLargestComponent;
    green = 0;
    blue = chroma;
  } else {
    red = chroma;
    green = 0;
    blue = secondLargestComponent;
  }

  // Add the lightness adjustment to each component
  red += lightnessAdjustment;
  green += lightnessAdjustment;
  blue += lightnessAdjustment;

  // Convert the RGB values to the range 0-255 and round to the nearest integer
  red = Math.round(red * 255);
  green = Math.round(green * 255);
  blue = Math.round(blue * 255);

//   Return the RGB values as an array
  return [red, green, blue];
// 	saturation /= 100;
//   luminosity /= 100;
//   const k = n => (n + hue / 30) % 12;
//   const a = saturation * Math.min(luminosity, 1 - luminosity);
//   const f = n =>
//     luminosity - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
//   return [255 * f(0), 255 * f(8), 255 * f(4)];
}