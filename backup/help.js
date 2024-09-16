export default {
    execute: async function(args, terminal) {
        terminal.animateText('Available commands!') ;
        terminal.printHelpAnimated();
    },
    description: 'Display help information for available commands'
};
