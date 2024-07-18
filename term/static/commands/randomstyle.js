export default {
    execute: function(args, terminal) {
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function setColor(element, color) {
            element.style.backgroundColor = color.background;
            element.style.color = color.foreground;
        }

        const backgroundColor = getRandomColor();
        let foregroundColor = getRandomColor();

        // Ensure foreground color is different from background color
        while (backgroundColor === foregroundColor) {
            foregroundColor = getRandomColor();
        }

        const promptColor = getRandomColor();
        const promptText = 'root@trsh';

        const style = {
            background: backgroundColor,
            foreground: foregroundColor,
            prompt: promptColor,
            promptText: promptText
        };

        // Apply styles
        terminal.element.style.backgroundColor = style.background;
        terminal.element.style.color = style.foreground;
        terminal.promptElement.style.color = style.prompt;
        terminal.promptText = style.promptText;

        // Save styles to localStorage
        localStorage.setItem('terminalStyle', JSON.stringify(style));

        terminal.printLine(`Background color set to: ${style.background}`);
        terminal.printLine(`Foreground color set to: ${style.foreground}`);
        terminal.printLine(`Prompt color set to: ${style.prompt}`);
        terminal.printLine(`Prompt text set to: ${style.promptText}`);
    },
    description: 'Apply a random style to the terminal'
};
