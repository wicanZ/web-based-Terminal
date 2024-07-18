export default {
    execute: async function(args, terminal) {
        terminal.print('Enter username: ');

        // Store the original callback and input field type
        const originalCallback = terminal.inputCallback;
        const originalInputType = terminal.inputElement.type;

        // Disable the terminal's input callback
        terminal.inputCallback = null;

        // Function to capture input
        const captureInput = (hideInput = false) => {
            return new Promise(resolve => {
                const inputHandler = event => {
                    if (event.key === 'Enter') {
                        const inputValue = terminal.inputElement.value.trim();
                        terminal.inputElement.value = '';
                        terminal.inputElement.removeEventListener('keydown', inputHandler);
                        terminal.inputElement.type = 'text';
                        resolve(inputValue);
                    } else if (hideInput) {
                        terminal.inputElement.type = 'password';
                    }
                };

                terminal.inputElement.addEventListener('keydown', inputHandler);
                terminal.inputElement.focus();
            });
        };

        try {
            // Capture username
            const username = await captureInput();
            terminal.printLine(`Captured username: ${username}`);
            terminal.print('Enter password: ');

            // Capture password with hidden input
            const password = await captureInput(true);
            terminal.printLine('Password captured');

            // Send the login request to the backend
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
                } else {
                    terminal.printLine('Login failed: ' + result.message);
                }
            } else {
                terminal.printLine('Error: Unable to reach the server.');
            }
        } catch (error) {
            terminal.printLine('Error: ' + error.message);
        } finally {
            // Re-enable the terminal's input callback and restore the input field type
            terminal.inputCallback = originalCallback;
            terminal.inputElement.type = originalInputType;
        }
    },
    description: 'Login with username and password',
};
