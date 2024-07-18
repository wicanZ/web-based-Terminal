export default {
    execute: async function(args, terminal) {
        terminal.displayOutput('Fetching disk usage...');

        try {
            // Simulate fetching disk usage statistics (replace with actual logic)
            const diskUsage = await fetchDiskUsage(); // Assuming fetchDiskUsage is a function to fetch data

            // Display disk usage information
            if (diskUsage) {
                const formattedOutput = formatDiskUsage(diskUsage);
                terminal.displayOutput(formattedOutput);
            } else {
                terminal.displayOutput('Failed to fetch disk usage information.');
            }
        } catch (error) {
            console.error('Error fetching disk usage:', error);
            terminal.displayOutput('Error fetching disk usage information.');
        }
    },
    description: 'Display disk usage statistics.',
};

// Function to fetch disk usage statistics (simulated)
async function fetchDiskUsage() {
    // Simulated data (replace with actual fetch logic)
    return {
        total: 10000000000, // Total disk space in bytes
        used: 5000000000,   // Used disk space in bytes
        free: 5000000000,   // Free disk space in bytes
        bamspace: 200000,
    };
}

// Function to format disk usage information
function formatDiskUsage(diskUsage) {
    const { total, used, free , bamspace } = diskUsage;

    return `
        Total: ${formatBytes(total)}
        Used: ${formatBytes(used)}
        Free: ${formatBytes(free)}
        Bam : ${formatBytes(bamspace)}
    `;
}

// Helper function to format bytes into a human-readable format
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}


// export default {
//     execute: async function(args, terminal) {
//         const response = await fetch('/execute_command/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': terminal.getCookie('csrftoken')
//             },
//             body: JSON.stringify({ command: 'df', args: args })
//         });

//         const data = await response.json();
//         terminal.displayOutput(data.response);
//     },
//     description: 'Display disk usage'
// };

