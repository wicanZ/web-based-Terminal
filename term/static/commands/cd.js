export default {
    execute: async function(args, terminal) {
        const newPath = args[1] || '/'; // Default to root if no path provided

        const commandWithArgs = `cd ${args.join(' ')}`;
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
        terminal.displayOutput(data.current_dir) ;
        if (data.response.startsWith('Changed directory to:')) {
            localStorage.setItem('current_dir', data.current_dir);
        }
        terminal.displayOutput(data.response);
    },
    description: 'Change directory'
};

