export default {
    execute: async function(args, terminal) {
        const commandWithArgs = `ls ${args.join(' ')}`;
        const currentDir = localStorage.getItem('current_dir') || '/';

        const response = await fetch('/execute_command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ command: commandWithArgs, current_dir: currentDir })
        });

        const data = await response.json();
        terminal.displayOutput(data.response);
    },
    description: 'List directory contents'
};
