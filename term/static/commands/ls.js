// ./commands/ls.js
export default {
    execute: async function(args, terminal) {
        // Combine command and arguments
        const commandWithArgs = `ls ${args.join(' ')}`;

        // Example implementation of the 'ls' command
        const response = await fetch('/execute_command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ command: commandWithArgs })
        });

        const data = await response.json();
        terminal.displayOutput(data.response);
    },
    description: 'List directory contents'
};
