export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.displayOutput("mkdir: missing operand");
            return;
        }

        const dirName = args[0];
        const response = await fetch('/make_directory/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ dir_name: dirName })
        });

        const data = await response.json();
        if (data.success) {
            terminal.displayOutput(`Directory '${dirName}' created`);
        } else {
            terminal.displayOutput(`mkdir: ${data.error}`);
        }
    },
    description: 'Create a new directory'
};
