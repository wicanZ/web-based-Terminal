export default {
    execute: async function(args, terminal) {
        // Assume you have a method to check if the user is logged in
        const isLoggedIn = terminal.checkLoginStatus(); // Replace with your actual method to check login status

        if (isLoggedIn) {
            // Display the current user (e.g., from a stored user profile or session)
            const currentUser = terminal.getCurrentUser(); // Replace with your actual method to get the current user
            terminal.displayOutput(`Current user: ${currentUser}`);
        } else {
            // Display quest mode message
            terminal.displayOutput('You are currently in guest mode. Please log in to see the current user.');
        }
    },
    description: 'Display current user'
};

