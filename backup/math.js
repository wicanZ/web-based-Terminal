export default {
    execute: async function(args, terminal) {
        const promptUser = (question) => {
            return new Promise(resolve => {
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = null; // Clear input callback to prevent re-triggering
                    resolve(input.trim());
                };
                terminal.printLine(question);
            });
        };

        const generateArithmeticExpression = () => {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const operators = ['+', '-', '*', '/'];
            const operator = operators[Math.floor(Math.random() * operators.length)];
            return { question: `${num1} ${operator} ${num2}`, answer: eval(`${num1} ${operator} ${num2}`).toFixed(2) };
        };

        const generateSquareRootQuestion = () => {
            const num = Math.floor(Math.random() * 100) + 1;
            return { question: `What is the square root of ${num}?`, answer: Math.sqrt(num).toFixed(2) };
        };

        const generateMultiplicationTableQuestion = () => {
            const num = Math.floor(Math.random() * 10) + 1;
            const multiplier = Math.floor(Math.random() * 10) + 1;
            return { question: `What is ${num} times ${multiplier}?`, answer: (num * multiplier).toFixed(2) };
        };

        const generateQuestion = () => {
            const questionTypes = [generateArithmeticExpression, generateSquareRootQuestion, generateMultiplicationTableQuestion];
            const randomQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            return randomQuestion();
        };

        let score = 0;
        terminal.printLine("Welcome to the Enhanced Math Game!");
        terminal.printLine("You will be given random math questions to solve.");
        terminal.printLine("You have 15 seconds to answer each question.");

        for (let i = 0; i < 10; i++) {
            const { question, answer } = generateQuestion();
            let userAnswer = null;

            const timer = setTimeout(() => {
                if (userAnswer === null) {
                    terminal.inputCallback = null; // Clear input callback to prevent re-triggering
                    terminal.printLine("Time's up! Moving to the next question.");
                }
            }, 15000);

            userAnswer = await promptUser(question);
            clearTimeout(timer);

            if (userAnswer === answer) {
                score++;
                terminal.printLine("Correct!");
            } else {
                terminal.printLine(`Incorrect! The correct answer was ${answer}.`);
            }
        }

        terminal.printLine(`Game over! Your score is ${score} out of 10.`);
    },
    description: 'Play an enhanced math game with various types of math questions'
};
