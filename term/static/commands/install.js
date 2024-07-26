export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.displayOutput('Error: No package specified.');
            return;
        }
        if(args[0] === 'all'){
            terminal.displayOutput('All : No package specified.');
        }

        
        const packageName = args[0];
        console.log(packageName);
        terminal.displayOutput(`Installing package: ${packageName}...`);
        
        try {
            await terminal.loadCommand(packageName);
            terminal.displayOutput(`Package ${packageName} installed successfully.`);
        } catch (error) {
            terminal.displayOutput(`Error installing package ${packageName}: ${error.message}`);
        }
    },
    description: 'Install a package dynamically',
};

