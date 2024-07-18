export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.displayOutput('Error: No package specified.');
            return;
        }

        const packageName = args[0];
        terminal.displayOutput(`Installing package: ${packageName}...`);

        try {
            await terminal.loadCommand(`${packageName}.js`);
            terminal.displayOutput(`Package ${packageName} installed successfully.`);
        } catch (error) {
            terminal.displayOutput(`Error installing package ${packageName}: ${error.message}`);
        }
    },
    description: 'Install a package dynamically | addcommand  '
};
