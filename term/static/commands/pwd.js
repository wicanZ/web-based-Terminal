export default {
    execute: async function(args, terminal) {
        // Send request to backend to get current working directory
        const response = await fetch('/execute_command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ command: 'pwd' })
        });

        const data = await response.json();
        terminal.displayOutput(data.response);
    },
    description: 'Print working directory'
};
