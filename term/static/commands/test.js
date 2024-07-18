export default {
    execute: async function(args, terminal) {
        terminal.animateText('Available commands!');
        terminal.animateTextLine('Welcome to my terminal world!');
        this.Me('hello,', terminal);  // Use 'this' to refer to the current object
    },
    Me: function(text, terminal) {
        terminal.printLine('me is working');
        terminal.printLine(text);
    },
    description: 'Testing for available commands'
};
