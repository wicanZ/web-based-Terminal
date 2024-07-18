export default {
    execute: async function(args, terminal) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.js';
        
        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return;
            
            const formData = new FormData();
            formData.append('command', file);
            
            try {
                const response = await fetch('/upload_command/', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    terminal.printLine(`Command ${file.name} uploaded successfully.`);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                terminal.printError(`Error uploading command: ${error.message}`);
            }
        };
        
        fileInput.click();
    },
    description: 'Upload a JavaScript file to add a new command',
};
