export default {
    execute: async function(args, terminal) {
        const url = args[0];
        if (!url) {
            terminal.printLine('Usage: curl <url>');
            return;
        }

        try {
            const response = await fetch(url);
            const data = await response.text();
            terminal.printLine(data);
        } catch (error) {
            terminal.printLine(`Error fetching ${url}: ${error.message}`);
        }
    },
    description: 'Fetch the content of a URL'
};
