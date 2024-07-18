export default {
    execute: function(args, terminal) {
        if (args.length !== 2) {
            terminal.displayOutput("Usage: mv [source] [destination]", 'error');
            return;
        }
        const [source, destination] = args;
        // Implement move or rename logic here
        terminal.displayOutput(`Moved ${source} to ${destination}`);
    },
    description: "Move or rename a file or directory",
    args: {
        "source": "Source file or directory",
        "destination": "Destination file or directory"
    },
    helpVisible: true
};
