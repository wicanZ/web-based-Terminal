export default {
    execute: function(args, terminal) {
        if (args.length === 0) {
            terminal.displayOutput('Error: No package specified.');
            return;
        }

        const packageName = args[0];
        if (terminal.commands[packageName]) {
            delete terminal.commands[packageName];
            terminal.displayOutput(`Package ${packageName} removed successfully.`);
        } else {
            terminal.displayOutput(`Error: Package ${packageName} not found.`);
        }
    },
    description: 'Remove an installed package'
};
