// ./commands/register.js

export default {
    execute: async function(args, terminal) {
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

                terminal.print(question);
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

        const isEmpty = (text) => {
            if (text.trim() === '') {
                terminal.printLine('Input cannot be empty.');
                return true;
            }
            return false;
        };

        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        const username = localStorage.getItem('username');

        if (isLoggedIn && username) {
            terminal.printLine(`You are already logged in as ${username}.`);
            return;
        }

        try {
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

            const response = await fetch('/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    terminal.printLine('Registration successful!');
                    terminal.isLoggedIn = true;
                    terminal.username = username;
                    localStorage.setItem('is_logged_in', 'true');
                    localStorage.setItem('username', username);
                    localStorage.setItem('userIp', result.ip);
                } else {
                    terminal.printLine('Registration failed: ' + result.message);
                }
            } else {
                terminal.printLine('Error: Unable to reach the server.');
            }
        } catch (error) {
            terminal.printLine('Error: ' + error.message);
        }
    },
    description: 'Register a new user',
};
