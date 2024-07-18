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

        // Create the calculator display
        const display = document.createElement('input');
        display.type = 'text';
        display.id = 'calculator-display';
        display.readOnly = true;
        display.style.width = '100%';
        display.style.height = '40px';
        display.style.textAlign = 'right';
        display.style.marginBottom = '10px';

        calculatorContainer.appendChild(display);

        // Create calculator buttons
        const buttons = [
            '7', '8', '9', '/', 
            '4', '5', '6', '*', 
            '1', '2', '3', '-', 
            '0', '.', '=', '+'
        ];

        buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = button;
            buttonElement.style.width = '25%';
            buttonElement.style.height = '40px';
            buttonElement.addEventListener('click', () => {
                if (button === '=') {
                    try {
                        display.value = eval(display.value);
                    } catch {
                        display.value = 'Error';
                    }
                } else {
                    display.value += button;
                }
            });
            calculatorContainer.appendChild(buttonElement);
        });

        // Append the calculator container to the body
        document.body.appendChild(calculatorContainer);

        // Disable terminal input
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
