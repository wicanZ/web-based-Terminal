export default {
    execute: async function(args, terminal) {
        const command = args[0];
        if (!command) {
            terminal.printError("Usage: whereis <command>");
            return;
        }

        if (terminal.commandExists(command)) {
            terminal.printLine(`${command} is located at /static/commands/${command}.js`);
        } else {
            terminal.printError(`whereis: ${command}: unknown command`);
        }
    },
    description: 'Show the location of a command',
};
