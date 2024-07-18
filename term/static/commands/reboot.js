export default {
    execute: function(args, terminal) {
        terminal.printLine("Rebooting...");
        setTimeout(() => {
            location.reload();
            localStorage.clear(); 
        }, 1000); // Delays the reload for 1 second to show the reboot message
    },
    description: 'Simulate a system reboot by refreshing the page'
};
