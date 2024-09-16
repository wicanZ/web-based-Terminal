export default {
    execute: async function(args, terminal) {
        const response = await fetch('/execute_command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ command: 'uname', args: args })
        });

        const data = await response.json();
        terminal.displayOutput(data.response);
    },
    description: 'Print system information'
};
