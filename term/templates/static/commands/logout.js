export default {
    execute: async function(args, terminal) {
        const validCommands = ['help', 'logout help' ,'master'];  // List of valid commands for comparison
        
        // Function to suggest the closest valid command for typos
        const suggestClosestCommand = (input) => {
            if (input.length >= 2) {
                // Check if the input is close to a known command
                const suggestion = validCommands.find(cmd => cmd.startsWith(input.slice(0, 2))); 
                if (suggestion) {
                    terminal.printLine(`<span style="color: #E74C3C;">Did you mean:</span> <span style="color: #4CAF50; font-weight: bold;">${suggestion}</span>`);
                } else {
                    terminal.printLine(`<span style="color: #E74C3C;">Unknown command:</span> ${input}`);
                }
            } else {
                terminal.printLine(`<span style="color: #E74C3C;">Unknown command:</span> ${input}`);
            }
        };

        // Handle all typos for 'help' and suggest the correct command
        if (args[0] && args[0] !== 'help' && args[0] !== 'logout') {
            suggestClosestCommand(args.join(' '));
            return;
        }

        // If the user asks for help (e.g., 'logout help')
        if (args[0] === 'help') {
            terminal.printLine('<span style="color: #4CAF50; font-weight: bold;">Usage:</span> <span style="color: #FFC107;">logout</span>');
            terminal.printLine('<span style="color: #4CAF50; font-weight: bold;">Description:</span> <span style="color: #FFC107;">Logs you out of the current session.</span>');
            terminal.printLine('<span style="color: #4CAF50; font-weight: bold;">Example:</span>');
            terminal.printLine('<span style="color: #FFC107; font-family: monospace;">  logout</span>');
            return;
        }

        try {
            // Send a POST request to log the user out
            const response = await fetch('/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')  // Get CSRF token from terminal
                }
            });

            if (response.ok) {
                const result = await response.json();
                
                // Clear the terminal's session-related variables
                terminal.isLoggedIn = false;
                terminal.username = null;
                terminal.ip = null;

                // Clear sessionStorage and localStorage
                sessionStorage.clear();
                localStorage.clear();

                // Print the logout message
                terminal.printLine('<span style="color: #E74C3C; font-weight: bold;">You have been logged out successfully. The page will now reload.</span>');
                
                // Reload the page after 2 seconds
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                throw new Error(`Logout failed with status ${response.status}`);
            }
        } catch (error) {
            terminal.printError(`<span style="color: #E74C3C;">Error during logout:</span> ${error.message}`);
        }
    },
    description: 'Log out the current user',
};
