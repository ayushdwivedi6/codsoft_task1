const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.textContent = currentInput;
    previousDisplay.textContent = operator
        ? `${previousInput} ${getOperatorSymbol(operator)}`
        : "";
}

function getOperatorSymbol(value) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[value] || value;
}

function appendNumber(number) {
    if (currentInput === "Error" || shouldResetDisplay) {
        currentInput = "0";
        shouldResetDisplay = false;
    }

    if (number === "." && currentInput.includes(".")) {
        return;
    }

    if (number === "." && currentInput === "0") {
        currentInput = "0.";
    } else if (currentInput === "0" && number !== ".") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentInput === "Error") {
        return;
    }

    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }

    previousInput = currentInput;
    operator = selectedOperator;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (operator === null || previousInput === "") {
        return;
    }

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);
    let result;

    if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
        showError();
        return;
    }

    if (operator === "+") {
        result = firstNumber + secondNumber;
    } else if (operator === "-") {
        result = firstNumber - secondNumber;
    } else if (operator === "*") {
        result = firstNumber * secondNumber;
    } else if (operator === "/") {
        if (secondNumber === 0) {
            showError();
            return;
        }

        result = firstNumber / secondNumber;
    }

    if (!Number.isFinite(result)) {
        showError();
        return;
    }

    currentInput = formatResult(result);
    previousInput = "";
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function formatResult(result) {
    if (Number.isInteger(result)) {
        return String(result);
    }

    return String(Number(result.toFixed(10)));
}

function clearCalculator() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteNumber() {
    if (shouldResetDisplay || currentInput === "Error") {
        return;
    }

    if (currentInput.length <= 1) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

function showError() {
    currentInput = "Error";
    previousInput = "";
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    if (button.dataset.action === "equals") {
        calculate();
    } else if (button.dataset.action === "clear") {
        clearCalculator();
    } else if (button.dataset.action === "delete") {
        deleteNumber();
    }
});

document.addEventListener("keydown", (event) => {
    if (/^[0-9.]$/.test(event.key)) {
        appendNumber(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteNumber();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();
