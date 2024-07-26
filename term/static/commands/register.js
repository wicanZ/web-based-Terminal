export default {
    execute: async function(args, terminal) {
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

        const isEmpty = (text) => {
            if (text.trim() === '') {
                terminal.printLine('Input cannot be empty.');
                return true;
            }
            return false;
        };

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
