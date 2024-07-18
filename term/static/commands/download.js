export default {
    execute: async function(args, terminal) {
        if (args.length !== 1) {
            terminal.displayOutput('Usage: download <file_url>');
            return;
        }

        const fileUrl = args[0];

        try {
            terminal.displayOutput(`Downloading file from ${fileUrl}...`);
            
            // Use a utility function to download the file
            const success = await downloadFile(fileUrl);

            if (success) {
                terminal.displayOutput('File downloaded successfully.');
            } else {
                terminal.displayOutput('Failed to download the file.');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            terminal.displayOutput('Error downloading the file.');
        }
    },
    description: 'Download a file from a specified URL.',
};

// Function to download a file
async function downloadFile(fileUrl) {
    try {
        // Create a hidden link element
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = fileUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
        return true;
    } catch (error) {
        console.error('Error in downloadFile:', error);
        return false;
    }
}

