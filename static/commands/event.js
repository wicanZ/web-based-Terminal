// ./commands/ctf.js
export default {
    execute: async function(args, terminal) {
        // Function to prompt the user for input
        const promptUser = (question, hideInput = false) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputElement.type = 'text'; // Reset input type before resolving
                    terminal.inputCallback = originalCallback; // Restore original callback
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

        // Function to create an event
        const createEvent = async () => {
            let text, date;

            do {
                text = await promptUser('Enter event text: ');
            } while (isEmpty(text));

            do {
                date = await promptUser('Enter event date (YYYY-MM-DD): ');
            } while (isEmpty(date));

            const response = await fetch('/create_event/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                },
                body: JSON.stringify({ text, date })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    terminal.printLine(`Event created: ${result.event.text} on ${result.event.date}`);
                } else {
                    terminal.printLine('Event creation failed: ' + result.message);
                }
            } else {
                terminal.printLine('Error: Unable to reach the server.');
            }
        };

        // Function to display events
        const displayEvents = async () => {
            const response = await fetch('/get_events/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.events.length > 0) {
                    terminal.printLine('Events:');
                    result.events.forEach(event => {
                        terminal.printLine(`${event.text} on ${event.date}`);
                    });
                } else {
                    terminal.printLine('No events found.');
                }
            } else {
                terminal.printLine('Error: Unable to reach the server.');
            }
        };

        // Main command execution
        if (args.length === 0) {
            terminal.printLine('Usage: event [add|list]');
            return;
        }

        const command = args[0];

        if (command === 'add') {
            await createEvent();
        } else if (command === 'list') {
            await displayEvents();
        } else {
            terminal.printLine('Unknown command. Usage: event [add|list]');
        }
    },
    description: 'Manage events: add new events or list existing events'
};
