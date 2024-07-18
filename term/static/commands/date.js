export default {
    execute: function(args, terminal) {
        const now = new Date();
        terminal.animateTextLine(`Current date and time: ${now.toString()}`);
    },
    description: 'Displays the current date and time'
};
