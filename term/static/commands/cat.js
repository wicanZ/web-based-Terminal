export default {
    execute: async function(args, terminal) {
        const commandWithArgs = `cat ${args.join(' ')}`;
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
    description: 'Display file contents'
};



// export default {
//     execute: async function(args, terminal) {
//         console.log('Arguments:', args);  // Debugging line
//         if (args.length < 2) {
//             terminal.displayOutput('Usage: cat <filename>');
//             return;
//         }

//         const fileName = args[1];
//         const commandWithArgs = `cat ${fileName}`;
//         console.log('Command with Args:', commandWithArgs);  // Debugging line

//         const response = await fetch('/execute_command/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': terminal.getCookie('csrftoken')
//             },
//             body: JSON.stringify({ command: commandWithArgs, current_dir: terminal.currentDir })
//         });

//         const data = await response.json();
//         if (data.response) {
//             terminal.displayOutput(data.response);
//         } else {
//             terminal.displayOutput(`Error: ${data.error}`);
//         }
//     },
//     description: 'Display the contents of a file'
// };
