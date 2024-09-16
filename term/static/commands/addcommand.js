export default {
    execute: async function(args, terminal) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.js';

        const promptUser = (message) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback;  // Reset callback
                    resolve(input.trim());
                };
                terminal.printLine(`<span style="color: lightyellow;">${message}</span>`);
            });
        };
        
        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return;

            // Collect additional data
            const fileName = await promptUser(`<span style="color: lightyellow;">Enter a file name:</span>`);
            if (!fileName) {
                terminal.printError("File name is required.");
                return;
            }

            // Collect user information if necessary
            const userId = terminal.username; // Example function to get user ID from the terminal or session


            const formData = new FormData();
            formData.append('command_file', file);
            formData.append('file_name', fileName);
            formData.append('user_id', userId);

            try {
                const response = await fetch('/upload_command/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': terminal.getCookie('csrftoken')
                    },
                    body: formData,
                });

                if (response.ok) {
                    terminal.printLine(`Command ${fileName} uploaded successfully.`);
                } else {
                    const errorData = await response.json(); // Parse the error response
                    terminal.printError(`Error uploading command: ${errorData.error || 'Unknown error'}`);
                }
            } catch (error) {
                terminal.printError(`Error uploading command: ${error.message}`);
            }
        };
        
        fileInput.click();
    },
    description: 'Upload a JavaScript file to add a new command',
};
