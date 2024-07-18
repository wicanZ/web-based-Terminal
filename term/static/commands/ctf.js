export default {
    execute: async function(args, terminal) {
        const promptUser = (question) => {
            return new Promise(resolve => {
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = null; // Clear input callback to prevent re-triggering
                    resolve(input.trim().toLowerCase());
                };
                terminal.printLine(question);
            });
        };

        const tasks = {
            easy: [
                { question: "What is 2 + 2?", answer: "4" },
                { question: "What is the color of the sky?", answer: "blue" },
                { question: "What is the opposite of hot?", answer: "cold" },
                { question: "What is 5 - 3?", answer: "2" },
                { question: "What is the capital of France?", answer: "paris" }
            ],
            medium: [
                { question: "What is the square root of 16?", answer: "4" },
                { question: "Name a programming language that starts with 'P'.", answer: "python" },
                { question: "What is 12 / 4?", answer: "3" },
                { question: "What is the third planet from the sun?", answer: "earth" },
                { question: "Who wrote 'To Kill a Mockingbird'?", answer: "harper lee" }
            ],
            hard: [
                { question: "What is 15 * 15?", answer: "225" },
                { question: "Who developed the theory of relativity?", answer: "einstein" },
                { question: "What is the derivative of x^2?", answer: "2x" },
                { question: "What year did World War II end?", answer: "1945" },
                { question: "What is the capital of Australia?", answer: "canberra" }
            ]
        };

        terminal.printLine("Welcome to Capture The Flag!");
        terminal.printLine("Choose your difficulty level: easy, medium, or hard");

        const difficulty = await promptUser("Enter difficulty level:");
        if (!tasks[difficulty]) {
            terminal.printLine("Invalid difficulty level. Please try again.");
            return;
        }

        for (const task of tasks[difficulty]) {
            const answer = await promptUser(task.question);
            if (answer !== task.answer) {
                terminal.printLine("Incorrect answer. Try again.");
                return;
            }
        }

        terminal.printLine("Congratulations! You have completed the Capture The Flag game!");
    },
    description: 'Play the Capture The Flag game by solving a series of questions'
};
