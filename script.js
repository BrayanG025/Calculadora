const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    
    try {
        const inputValue = eval(displayValue);

        if (operator && calculator.waitingForSecondOperand)  {
            calculator.operator = nextOperator;
            return;
        }

        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            calculator.displayValue = String(result);
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    } catch (error) {
        calculator.displayValue = "Error";
    }
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    'sqrt': (firstOperand) => Math.sqrt(firstOperand),
    'sin': (firstOperand) => Math.sin(toRadians(firstOperand)),
    'cos': (firstOperand) => Math.cos(toRadians(firstOperand)),
    'tan': (firstOperand) => Math.tan(toRadians(firstOperand)),
    'log': (firstOperand) => Math.log10(firstOperand),
    'exp': (firstOperand) => Math.exp(firstOperand),
    'pow': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
    '=': (firstOperand, secondOperand) => secondOperand
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        if (displayValue === '0' && digit !== '(') {
            calculator.displayValue = digit;
        } else {
            calculator.displayValue += digit;
        }
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) return;

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function backspace() {
    calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    //retroceso o backspace
    if (target.value === 'backspace') {
        backspace();
        updateDisplay();
        return;
    }

    // Manejar paréntesis
    if (target.value === '(' || target.value === ')') {
        if (calculator.displayValue === "0") {
            calculator.displayValue = target.value;
        } else {
        calculator.displayValue += target.value;
        }
        updateDisplay();
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

updateDisplay();
