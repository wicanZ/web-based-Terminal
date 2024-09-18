export default {
    execute: function(args, terminal) {
        // Check if the user asked for help (e.g., 'date help')
        if (args[0] === 'help') {
            terminal.printLine('<span style="color: lightblue;">Usage: date</span>');
            terminal.printLine('<span style="color: lightyellow;">This command displays the current date and time in Indian Standard Time (IST).</span>');
            terminal.printLine('<span style="color: lightyellow;">Example:</span>');
            terminal.printLine('<span style="color: lightgreen;">  date</span>');
            return;
        }

        const now = new Date();

        // Format the date and time for Indian Standard Time (IST)
        const formattedDate = now.toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            timeZone: 'Asia/Kolkata'
        });
        const formattedTime = now.toLocaleTimeString('en-IN', {
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,
            timeZone: 'Asia/Kolkata'
        });

        // Display the date and time in IST with styling
        terminal.animateTextLine('[] - Display Date and Time')
        terminal.printLine(`<span style="color: lightgreen;">Current date:</span> <span style="color: lightyellow;">${formattedDate}</span>`);
        terminal.printLine(`<span style="color: lightgreen;">Current time:</span> <span style="color: lightyellow;">${formattedTime}</span>`);
    },
    description: 'Displays the current date and time in Indian Standard Time (IST)'
};

