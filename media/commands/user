export default {
    execute: async function(args, terminal) {
        try {
            const response = await fetch('/user/details/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                },
            });

            if (response.ok) {
                const data = await response.json();
                terminal.printLine(`Username: ${data.username}`);
                terminal.printLine(`Email: ${data.email}`);
                terminal.printLine(`First Name: ${data.first_name}`);
                terminal.printLine(`Last Name: ${data.last_name}`);
                // Add more fields as needed
            } else {
                terminal.printLine('Error: Unable to fetch user details.');
            }
        } catch (error) {
            terminal.printLine('Error: Unable to reach the server.');
        }
    },

    description: 'Display the current user details'
};
