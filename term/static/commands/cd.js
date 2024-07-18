// ./commands/cd.js
export default {
    execute: async function(args, terminal) {
        const newPath = args[1] || '/'; // Default to root if no path provided
        terminal.printLine(args) ;
        const commandWithArgs = `cd ${args.join(' ')}`;

        const response = await fetch('/execute_command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ command: commandWithArgs, args: commandWithArgs })
        });

        const data = await response.json();
        terminal.displayOutput(`Changed directory to ${data.response}`);
        // if (data.success) {
        //     terminal.currentDir = newPath;
        //     terminal.displayOutput(`Changed directory to ${newPath}`);
        // } else {
        //     terminal.displayOutput(`Error: ${data.error}`);
        // }
    },
    description: 'Change directory'
};
