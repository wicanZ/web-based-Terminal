export default {
    execute: async function(args, terminal) {
        const response = await fetch('/get_quiz_results/');
        if (response.ok) {
            const result = await response.json();
            const now = new Date();

            if (new Date(result.result_available_time) <= now) {
                const sortedResults = result.results.sort((a, b) => b.score - a.score);
                terminal.printLine('Quiz Results:');
                sortedResults.forEach((res, index) => {
                    terminal.printLine(`${index + 1}. ${res.username} - ${res.score}`);
                });
            } else {
                terminal.printLine(`Results will be available after: ${result.result_available_time}`);
            }
        } else {
            terminal.printLine('Error: Unable to fetch quiz results.');
        }
    },
    description: 'Display quiz results sorted by score. Results available after a certain time.'
};
