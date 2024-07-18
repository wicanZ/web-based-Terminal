export default {
    execute: function(args, terminal) {
        const history = terminal.commandHistory[terminal.activeTab];
        if (history.length === 0) {
            terminal.printLine('No commands in history.');
        } else {
            history.forEach((command, index) => {
                terminal.printLine(`${index + 1}: ${command}`);
            });
        }
    },
    description: 'Display the command history'
};


// export default {
//     execute: async function(args, terminal) {
//         if (args.length === 0) {
//             terminal.printLine('Usage: download <filename>');
//             return;
//         }

//         const filename = args[0];
//         try {
//             const response = await fetch(`/download/${filename}`);
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.style.display = 'none';
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             window.URL.revokeObjectURL(url);
//             terminal.printLine(`Downloaded: ${filename}`);
//         } catch (error) {
//             terminal.printLine(`Error downloading file: ${error.message}`);
//         }
//     },
//     description: 'Download a file from the server'
// };



// export default {
//     execute: function(args, terminal) {
//         const history = terminal.commandHistory[terminal.activeTab];
//         if (history.length === 0) {
//             terminal.printLine('No commands in history.');
//         } else {
//             history.forEach((command, index) => {
//                 terminal.printLine(`${index + 1}: ${command}`);
//             });
//         }
//     },
//     description: 'Display the command history'
// };
