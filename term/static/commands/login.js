export default {
    execute: async function(args, terminal) {
        // Function to prompt the user for input
        const promptUser = (question, hideInput = false) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                let inputBuffer = '';

                const inputHandler = (event) => {
                    if (hideInput) {
                        const key = event.inputType === 'deleteContentBackward' ? 'Backspace' : event.data;
                        if (key === 'Backspace') {
                            inputBuffer = inputBuffer.slice(0, -1);
                        } else if (key) { // Only capture single characters
                            inputBuffer += key;
                        }
                        terminal.inputElement.value = '#'.repeat(inputBuffer.length);
                    }
                };

                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback; // Restore original callback
                    terminal.inputElement.type = 'text'; // Reset input type
                    terminal.inputElement.removeEventListener('input', inputHandler); // Remove input handler
                    resolve(inputBuffer.trim());
                };

                terminal.printLine(`<span style="color: lightblue;">${question}</span>`);
                if (hideInput) {
                    terminal.inputElement.type = 'text'; // Set input type to text to handle masking
                    terminal.inputElement.addEventListener('input', inputHandler); // Add input handler
                } else {
                    terminal.inputCallback = (input) => {
                        terminal.inputCallback = originalCallback; // Restore original callback
                        resolve(input.trim());
                    };
                }
            });
        };

        // Function to check if a string is empty
        const isEmpty = (text) => {
            if (text.trim() === '') {
                terminal.printLine('<span style="color: red;">Input cannot be empty.</span>');
                return true;
            }
            return false;
        };

        // Check if the user is already logged in
        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        const username = localStorage.getItem('username');

        if (isLoggedIn && username) {
            terminal.printLine(`<span style="color: lightgreen;">You are already logged in as ${username}.</span>`);
            return;
        }

        try {
            // Prompt the user for username and password
            let username;
            do {
                username = await promptUser('Enter username:');
            } while (isEmpty(username));

            terminal.printLine(`<span style="color: lightgreen;">Captured username: ${username}</span>`);

            let password;
            do {
                password = await promptUser('Enter password: ', true);
            } while (isEmpty(password));

            terminal.printLine('<span style="color: lightgreen;">Captured password: #########</span>');

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
                    terminal.printLine('<span style="color: green; font-weight: bold;">Login successful!</span>');
                    terminal.isLoggedIn = true;
                    terminal.username = username;
                    localStorage.setItem('is_logged_in', 'true');
                    localStorage.setItem('username', username);
                    localStorage.setItem('userIp', result.ip);
                } else {
                    terminal.printLine(`<span style="color: red;">Login failed: ${result.message}</span>`);
                }
            } else {
                terminal.printLine('<span style="color: red;">Error: Unable to reach the server.</span>');
            }
        } catch (error) {
            terminal.printLine(`<span style="color: red;">Error: ${error.message}</span>`);
        }
    },
    description: 'Login with username and password',
};
