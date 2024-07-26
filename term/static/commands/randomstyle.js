export default {
    execute: function(args, terminal) {
        // Function to generate a random color
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Function to apply color to terminal elements
        function setColor(element, color) {
            element.style.backgroundColor = color.background;
            element.style.color = color.foreground;
        }

        // Generate random colors for different elements
        const backgroundColor = '#000000';
        let foregroundColor = getRandomColor();

        // Ensure foreground color is different from background color
        while (backgroundColor === foregroundColor) {
            foregroundColor = getRandomColor();
        }

        const promptColor = getRandomColor();
        const promptText = 'root@trsh'; // Example prompt text

        // Define the style object
        const style = {
            borderColor: getRandomColor(),
            boxShadow: '0 0 10px rgba(0,0,0,0.5)', // Example box shadow
            backgroundColor: backgroundColor,
            textColor: foregroundColor,
            titleBarColor: getRandomColor(),
            borderRadius: '10px', // Example border radius
            fontSize: '16px',    // Example font size
            promptColor: promptColor,
            inputColor: getRandomColor(),
            promptText: promptText
        };

        // Apply styles using TerminalStyle class
        const terminalStyle = new TerminalStyle(terminal.element);
        terminalStyle.setBorderColor(style.borderColor);
        terminalStyle.setBoxShadow(style.boxShadow);
        terminalStyle.setBackgroundColor(style.backgroundColor);
        terminalStyle.setTextColor(style.textColor);
        terminalStyle.setTitleBarColor(style.titleBarColor);
        terminalStyle.setBorderRadius(style.borderRadius);
        terminalStyle.setFontSize(style.fontSize);
        terminalStyle.setPromptColor(style.promptColor);
        terminalStyle.setInputColor(style.inputColor);

        // Save styles to localStorage
        localStorage.setItem('terminalStyle', JSON.stringify(style));

        // Output messages to the terminal
        terminal.displayOutput(`Terminal styled with:
            Border color: ${style.borderColor}
            Box shadow: ${style.boxShadow}
            Background color: ${style.backgroundColor}
            Text color: ${style.textColor}
            Title bar color: ${style.titleBarColor}
            Border radius: ${style.borderRadius}
            Font size: ${style.fontSize}
            Prompt color: ${style.promptColor}
            Input color: ${style.inputColor}`);
    },
    description: 'Apply random styles to the terminal'
};
