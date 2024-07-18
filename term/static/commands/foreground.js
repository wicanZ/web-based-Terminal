export default {
    execute: function(args, terminal) {
        const OG_FOREGROUND_COLOR = '#ffffff'; // Original foreground color

        if (!args || args.length === 0) {
            terminal.displayOutput("Error: No color provided. Please provide a valid hex color code or 'reset'.");
            return;
        }
        const color = args[0];
        
        if (color.toLowerCase() === "reset") {
            terminal.outputElement.style.color = OG_FOREGROUND_COLOR;
            localStorage.removeItem('terminalForegroundColor'); // Remove stored color
            return;
        }
        
        // Simple regex to check if it's a valid hex color
        const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(color);

        if (isHexColor) {
            terminal.outputElement.style.color = color;
            localStorage.setItem('terminalForegroundColor', color); // Store color in localStorage
        } else {
            terminal.displayOutput("Error: Invalid color. Please provide a valid hex color code.");
        }
    },
    description: 'Change the foreground (text) color of the terminal',
    args: {
        "color": "The color to change the foreground to. Use 'reset' to revert to the original foreground color."
    }
};
