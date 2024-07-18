export default {
    aliases: {},
    execute: function(args, terminal) {
        if (args.length < 2) {
            terminal.printLine("Usage: alias <name> <command>");
            return;
        }
        const name = args.shift();
        const command = args.join(' ');
        this.aliases[name] = command;
        terminal.printLine(`Alias created: ${name} -> ${command}`);
    },
    description: 'Create an alias for a command'
};
