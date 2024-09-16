export default {
    execute: function(args, terminal) {
        if (args.length !== 2) {
            terminal.displayOutput("Usage: cp [source] [destination]", 'error');
            return;
        }
        const [source, destination] = args;
        // Implement copy logic here
        terminal.displayOutput(`Copied ${source} to ${destination}`);
    },
    description: "Copy a file or directory",
    args: {
        "source": "Source file or directory",
        "destination": "Destination file or directory"
    },
    helpVisible: true
};
