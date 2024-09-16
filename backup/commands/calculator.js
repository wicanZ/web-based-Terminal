export default {
    execute: async function(args, terminal) {
        // Create the calculator container
        const calculatorContainer = document.createElement('div');
        calculatorContainer.id = 'calculator-container';
        calculatorContainer.style.position = 'fixed';
        calculatorContainer.style.top = '50%';
        calculatorContainer.style.left = '50%';
        calculatorContainer.style.transform = 'translate(-50%, -50%)';
        calculatorContainer.style.padding = '20px';
        calculatorContainer.style.backgroundColor = '#001';
        calculatorContainer.style.border = '1px solid #000';
        calculatorContainer.style.zIndex = '1000';

        // Create the calculator display (where the user types)
        const display = document.createElement('input');
        display.type = 'text';
        display.id = 'calculator-display';
        display.style.width = '100%';
        display.style.height = '40px';
        display.style.textAlign = 'right';
        display.style.marginBottom = '10px';

        calculatorContainer.appendChild(display);

        // Create a result area to show the answer below the input
        const resultDisplay = document.createElement('div');
        resultDisplay.id = 'result-display';
        resultDisplay.style.width = '100%';
        resultDisplay.style.height = '40px';
        resultDisplay.style.textAlign = 'right';
        resultDisplay.style.color = '#0f0'; // Green for visibility
        resultDisplay.textContent = 'Result: ';
        calculatorContainer.appendChild(resultDisplay);

        // History stack for undo and redo
        let history = [];
        let redoStack = [];

        // Add input event listener to display automatic calculation result
        display.addEventListener('input', () => {
            try {
                resultDisplay.textContent = 'Result: ' + eval(display.value);
            } catch {
                resultDisplay.textContent = 'Result: Invalid expression';
            }
        });

        // Create calculator buttons without click event for '='
        const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+'];

        buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = button;
            buttonElement.style.width = '25%';
            buttonElement.style.height = '40px';
            buttonElement.addEventListener('click', () => {
                // Save the current state in the history stack for undo
                history.push(display.value);
                redoStack = []; // Clear redo stack on new input
                display.value += button;  // Add the button text to the display input
                display.dispatchEvent(new Event('input'));  // Trigger the input event to show the result
            });
            calculatorContainer.appendChild(buttonElement);
        });

        // Clear button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'C';
        clearButton.style.width = '25%';
        clearButton.style.height = '40px';
        clearButton.addEventListener('click', () => {
            // Clear the display and result
            history.push(display.value);
            redoStack = [];
            display.value = '';
            resultDisplay.textContent = 'Result: ';
        });
        calculatorContainer.appendChild(clearButton);

        // Undo button
        const undoButton = document.createElement('button');
        undoButton.textContent = 'Undo';
        undoButton.style.width = '25%';
        undoButton.style.height = '40px';
        undoButton.addEventListener('click', () => {
            if (history.length > 0) {
                // Save current state in redo stack
                redoStack.push(display.value);
                // Pop from history and set the display value
                display.value = history.pop();
                display.dispatchEvent(new Event('input'));  // Trigger input event to show the result
            }
        });
        calculatorContainer.appendChild(undoButton);

        // Redo button
        const redoButton = document.createElement('button');
        redoButton.textContent = 'Redo';
        redoButton.style.width = '25%';
        redoButton.style.height = '40px';
        redoButton.addEventListener('click', () => {
            if (redoStack.length > 0) {
                // Save current state in history stack
                history.push(display.value);
                // Pop from redo stack and set the display value
                display.value = redoStack.pop();
                display.dispatchEvent(new Event('input'));  // Trigger input event to show the result
            }
        });
        calculatorContainer.appendChild(redoButton);

        // Append the calculator container to the body
        document.body.appendChild(calculatorContainer);

        // Disable terminal input while calculator is open
        terminal.inputElement.disabled = true;

        // Add event listener to close calculator on Esc key press
        const closeCalculator = (event) => {
            if (event.key === 'Escape') {
                document.body.removeChild(calculatorContainer);
                terminal.inputElement.disabled = false;
                terminal.inputElement.focus();
                document.removeEventListener('keydown', closeCalculator);
            }
        };

        document.addEventListener('keydown', closeCalculator);
    },
    description: 'Pop up a calculator app on screen'
};
