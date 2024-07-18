export default {
    execute: async function(args, terminal) {
        // Combine command and arguments
        const subcommand = args[0];

        // Example implementation of the 'json' command
        const response = await fetch('/execute_command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ command: `json ${subcommand}`, args: args.slice(1) })
        });

        const data = await response.json();
        terminal.displayOutput(JSON.stringify(data.response, null, 2)); // Pretty print JSON
    },
    description: 'Perform JSON operations'
};
