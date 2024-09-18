export default {
    execute: function(args, terminal) {
        const OG_BACKGROUND_COLOR = '#000000'; // Original background color

        if (!args || args.length === 0) {
            terminal.displayOutput("Error: No color provided. Please provide a valid hex color code or 'reset'.");
            return;
        }

        const color = args[0];

        if (color.toLowerCase() === "reset") {
            terminal.element.style.backgroundColor = OG_BACKGROUND_COLOR;
            localStorage.removeItem('terminalBackgroundColor'); // Remove stored color
            return;
        }

        // Simple regex to check if it's a valid hex color
        const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(color);

        if (isHexColor) {
            terminal.element.style.backgroundColor = color;
            localStorage.setItem('terminalBackgroundColor', color); // Store color in localStorage
        } else {
            terminal.displayOutput("Error: Invalid color. Please provide a valid hex color code.");
        }
    },
    description: 'Change the background color of the terminal',
    // args: {
    //     "color": "The color to change the background to. Use 'reset' to revert to the original background color."
    // }
};
