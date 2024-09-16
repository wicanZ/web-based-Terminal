export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine('Usage: json <command>');
            return;
        }

        const [subCommand, ...subArgs] = args;

        // A map of supported commands and their corresponding actions
        const supportedCommands = {
            'ls': async () => {
                const files = await terminal.executeCommand('ls');
                return files.split('\n').filter(file => file !== '');
            },
            'ip': async () => {
                const ip = await terminal.executeCommand('ip');
                return { ip: ip.trim() };
            }
        };

        if (!supportedCommands[subCommand]) {
            terminal.printLine(`Error: Unsupported command "${subCommand}"`);
            return;
        }

        try {
            const result = await supportedCommands[subCommand](subArgs);
            terminal.printLine(JSON.stringify(result, null, 2));
        } catch (error) {
            terminal.printLine(`Error: ${error.message}`);
        }
    },
    description: 'Execute a command and display the result in JSON format'
};
