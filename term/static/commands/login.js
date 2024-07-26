export default {
    execute: async function(args, terminal) {
        // Function to prompt the user for input
        const promptUser = (question, hideInput = false) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback; // Restore original callback
                    terminal.inputElement.type = 'text'; // Reset input type
                    resolve(input.trim());
                };
                terminal.print(question);
                if (hideInput) {
                    terminal.inputElement.type = 'password';
                }
            });
        };

        // Function to check if a string is empty
        const isEmpty = (text) => {
            if (text.trim() === '') {
                terminal.printLine('Input cannot be empty.');
                return true;
            }
            return false;
        };

        // Check if the user is already logged in
        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        const username = localStorage.getItem('username');

        if (isLoggedIn && username) {
            terminal.printLine(`You are already logged in as ${username}.`);
            return;
        }

        try {
            // Prompt the user for username and password
            let username;
            do {
                username = await promptUser('Enter username: ');
            } while (isEmpty(username));

            terminal.printLine(`Captured username: ${username}`);

            let password;
            do {
                password = await promptUser('Enter password: ', true);
            } while (isEmpty(password));

            terminal.printLine(`Captured password: ${password}`);

            // Send login request to the server
            const response = await fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    terminal.printLine('Login successful!');
                    terminal.isLoggedIn = true;
                    terminal.username = username;
                    localStorage.setItem('is_logged_in', 'true');
                    localStorage.setItem('username', username);
                    localStorage.setItem('userIp', result.ip);
                } else {
                    terminal.printLine('Login failed: ' + result.message);
                }
            } else {
                terminal.printLine('Error: Unable to reach the server.');
            }
        } catch (error) {
            terminal.printLine('Error: ' + error.message);
        }
    },
    description: 'Login with username and password',
};
