export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine("Usage: nano <command-name>");
            return;
        }

        const commandName = args[0];
        const fileName = `${commandName}.js`;

        try {
            const response = await fetch(`/get_filecommand/${fileName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const { content } = await response.json();
            terminal.printLine(`Editing ${fileName}:`);
            this.openEditor(fileName, content, terminal);
        } catch (error) {
            terminal.printLine(`Error fetching file: ${error.message}`);
        }
    },

    openEditor: function(fileName, content, terminal) {
        const editor = document.createElement('textarea');
        editor.value = content;
        editor.style.width = '100%';
        editor.style.height = '400px';
        editor.style.backgroundColor = '#000';
        editor.style.color = '#fff';
        editor.style.border = '1px solid #fff';
        terminal.outputElement.appendChild(editor);
        terminal.inputElement.disabled = true;

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.onclick = async () => {
            const newContent = editor.value;
            try {
                const response = await fetch('/save_command/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': terminal.getCookie('csrftoken')
                    },
                    body: JSON.stringify({ fileName, content: newContent }),
                });
                if (response.ok) {
                    terminal.printLine(`File ${fileName} saved successfully.`);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                terminal.printLine(`Error saving file: ${error.message}`);
            } finally {
                editor.remove();
                saveButton.remove();
                terminal.inputElement.disabled = false;
                terminal.inputElement.focus();
            }
        };

        terminal.outputElement.appendChild(saveButton);
    },

    description: 'Edit a command script by providing the command name'
};



// export default {
//     execute: async function(args, terminal) {
//         if (args.length === 0) {
//             terminal.printLine("Usage: nano <command-name>");
//             return;
//         }

//         const commandName = args[0];
//         const fileName = `${commandName}.js`;

//         try {
//             const response = await fetch(`/static/commands/${fileName}`);
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const fileContent = await response.text();
//             terminal.printLine(`Editing ${fileName}:`);
//             this.openEditor(fileName, fileContent, terminal);
//         } catch (error) {
//             terminal.printLine(`Error fetching file: ${error.message}`);
//         }
//     },
//     openEditor: function(fileName, content, terminal) {
//         const editor = document.createElement('textarea');
//         editor.value = content;
//         editor.style.width = '100%';
//         editor.style.height = '400px';
//         editor.style.backgroundColor = '#000';
//         editor.style.color = '#fff';
//         editor.style.border = '1px solid #fff';
//         terminal.outputElement.appendChild(editor);
//         terminal.inputElement.disabled = true;

//         const saveButton = document.createElement('button');
//         saveButton.innerText = 'Save';
//         saveButton.onclick = async () => {
//             const newContent = editor.value;
//             try {
//                 const response = await fetch('/save_command/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-CSRFToken': terminal.getCookie('csrftoken')
//                     },
//                     body: JSON.stringify({ fileName, content: newContent }),
//                 });
//                 if (response.ok) {
//                     terminal.printLine(`File ${fileName} saved successfully.`);
//                 } else {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//             } catch (error) {
//                 terminal.printLine(`Error saving file: ${error.message}`);
//             } finally {
//                 editor.remove();
//                 saveButton.remove();
//                 terminal.inputElement.disabled = false;
//                 terminal.inputElement.focus();
//             }
//         };

//         terminal.outputElement.appendChild(saveButton);
//     },
//     description: 'Edit a command script by providing the command name'
// };
