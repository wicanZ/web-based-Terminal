export default {
    execute: async function(args, terminal) {
        const fileName = args.join(' ').trim();
        if (!fileName) {
            terminal.printError("Please specify a file to edit.");
            return;
        }

        // Fetch file content from backend
        let fileContent = '';
        try {
            const response = await fetch('/get_file/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                },
                body: JSON.stringify({ fileName })
            });

            if (response.ok) {
                const data = await response.json();
                fileContent = data.content || ''; // Use the fetched file content
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            terminal.printError(`Error fetching file content: ${error.message}`);
            return;
        }

        // Create the editor container
        const editorContainer = document.createElement('div');
        editorContainer.id = 'editor-container';
        editorContainer.style.position = 'fixed';
        editorContainer.style.top = '0';
        editorContainer.style.left = '0';
        editorContainer.style.width = '100%';
        editorContainer.style.height = '100%';
        editorContainer.style.backgroundColor = '#1e1e1e';
        editorContainer.style.color = '#dcdcdc';
        editorContainer.style.zIndex = '1000';
        editorContainer.style.padding = '10px';
        editorContainer.style.boxSizing = 'border-box';

        // Create the text area
        const textArea = document.createElement('textarea');
        textArea.style.width = '100%';
        textArea.style.height = '90%';
        textArea.style.backgroundColor = '#1e1e1e';
        textArea.style.color = '#dcdcdc';
        textArea.style.border = 'none';
        textArea.style.fontSize = '14px';
        textArea.value = fileContent;
        editorContainer.appendChild(textArea);

        // Create the save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.display = 'block';
        saveButton.style.margin = '10px auto';
        saveButton.style.padding = '10px 20px';
        saveButton.style.backgroundColor = '#007acc';
        saveButton.style.color = '#ffffff';
        saveButton.style.border = 'none';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = async () => {
            const newContent = textArea.value;
            try {
                const response = await fetch('/save_file/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': terminal.getCookie('csrftoken')
                    },
                    body: JSON.stringify({ fileName, content: newContent })
                });

                if (response.ok) {
                    terminal.printLine(`File ${fileName} saved successfully.`);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                terminal.printError(`Error saving file: ${error.message}`);
            }

            document.body.removeChild(editorContainer);
        };
        editorContainer.appendChild(saveButton);

        // Add the editor container to the document body
        document.body.appendChild(editorContainer);

        // Close the editor on Esc or Ctrl+C
        const keydownHandler = (event) => {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                document.body.removeChild(editorContainer);
                document.removeEventListener('keydown', keydownHandler);
            }
        };
        document.addEventListener('keydown', keydownHandler);
    },
    description: 'Open a text editor to edit a file or command',
};
