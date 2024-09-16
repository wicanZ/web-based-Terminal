export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine('Usage: json <command> [arguments]');
            return;
        }

        const command = args.join(' ');

        try {
            const result = await terminal.executeCommand(command);
            const formattedResult = result.split('\n').filter(line => line !== '');
            terminal.printLine(JSON.stringify(formattedResult, null, 2));
        } catch (error) {
            terminal.printLine(`Error: ${error.message}`);
        }
    },
    description: 'Execute a command and display the result in JSON format'
};
