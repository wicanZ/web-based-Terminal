export default {
    execute: async function(args, terminal) {
        const command = args[0];
        if (!command) {
            terminal.printError("Usage: whatis <command>");
            return;
        }

        if (terminal.commandExists(command)) {
            const { description } = terminal.commands[command];
            terminal.printLine(`${command}: ${description}`);
        } else {
            terminal.printError(`whatis: ${command}: unknown command`);
        }
    },
    description: 'Display a brief description of a command',
};
