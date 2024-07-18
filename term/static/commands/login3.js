export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine('Usage: login <email> <password>');
            return;
        }

        const [email, password] = args;

        if (!email || !password) {
            terminal.printLine('Error: Both email and password are required.');
            return;
        }

        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    terminal.printLine(`Login successful! Welcome, ${result.user}.`);
                    localStorage.setItem('user', JSON.stringify(result.user)); // Save user to local storage
                } else if (result.message === 'register') {
                    terminal.printLine('User not found. Registering...');
                    const registerResponse = await fetch('/register/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(loginData)
                    });

                    if (registerResponse.ok) {
                        terminal.printLine('Registration successful! Please login again.');
                    } else {
                        terminal.printLine('Registration failed.');
                    }
                } else {
                    terminal.printLine('Login failed: ' + result.message);
                }
            } else {
                terminal.printLine('Error: Failed to connect to server.');
            }
        } catch (error) {
            terminal.printLine('Error: ' + error.message);
        }
    },
    description: 'Login or register with email and password'
};
