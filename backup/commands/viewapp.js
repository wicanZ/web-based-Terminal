export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine('Usage: view <app_name>');
            return;
        }

        const appName = args[0];

        try {
            const response = await fetch(`/view/${appName}/`);
            if (response.ok) {
                const app = await response.json();
                terminal.printLine(`Name: ${app.name}`);
                terminal.printLine(`Version: ${app.version}`);
                terminal.printLine(`Description: ${app.description}`);
                terminal.printLine(`Size: ${app.size} MB`);
                terminal.printLine(`Developer: ${app.developer}`);
                terminal.printLine(`Download URL: ${app.download_url}`);
            } else {
                terminal.printLine('Error: Unable to retrieve app details.');
            }
        } catch (error) {
            terminal.printLine('Error: Unable to reach the server.');
        }
    },

    description: 'View app details'
};
