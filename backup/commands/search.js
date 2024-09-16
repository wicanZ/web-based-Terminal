export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine('Usage: search <app_name>');
            return;
        }

        const appName = args[0];

        try {
            const response = await fetch(`/search/${appName}/`);
            if (response.ok) {
                const data = await response.json();
                if (data.apps.length > 0) {
                    data.apps.forEach(app => {
                        terminal.printLine(`${app.name} - v${app.version}`);
                        terminal.printLine(`Description: ${app.description}`);
                    });
                } else {
                    terminal.printLine('No apps found.');
                }
            } else {
                terminal.printLine('Error: Unable to search for apps.');
            }
        } catch (error) {
            terminal.printLine('Error: Unable to reach the server.');
        }
    },

    description: 'Search for an app'
};
