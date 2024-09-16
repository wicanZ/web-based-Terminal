export default {
    execute: async function(args, terminal) {
        terminal.printLine("Fetching your IP address...");

        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            terminal.printLine(`Your public IP address is: ${data.ip}`);
        } catch (error) {
            terminal.printLine(`Error fetching IP address: ${error.message}`);
        }
    },
    description: 'Fetch and display your public IP address'
};
