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

        const jsTutorial = [
            {
                explanation: "JavaScript is a versatile programming language used primarily for web development.",
                question: "Which keyword is used to declare a variable in JavaScript?",
                options: ["let", "var", "const", "All of the above"],
                answer: "All of the above"
            },
            {
                explanation: "Functions in JavaScript allow you to define reusable blocks of code.",
                question: "How do you define a function in JavaScript?",
                options: ["function myFunction() {}", "def myFunction() {}", "function: myFunction {}", "func myFunction() {}"],
                answer: "function myFunction() {}"
            },
            {
                explanation: "Arrays in JavaScript are used to store multiple values in a single variable.",
                question: "How do you create an array in JavaScript?",
                options: ["let myArray = []", "let myArray = {}", "let myArray = ()", "let myArray = <>"],
                answer: "let myArray = []"
            },
            {
                explanation: "JavaScript supports various data types including strings, numbers, and booleans.",
                question: "What data type is the value `true`?",
                options: ["string", "number", "boolean", "object"],
                answer: "boolean"
            },
            {
                explanation: "JavaScript objects are collections of key-value pairs.",
                question: "How do you access the value of a property in a JavaScript object?",
                options: ["object['property']", "object.property", "Both A and B", "None of the above"],
                answer: "Both A and B"
            },{
                explanation: "JavaScript is a scripting language that allows you to implement complex features on web pages. It makes web pages interactive and dynamic.",
                question: "Which of the following is NOT a data type in JavaScript?",
                options: ["string", "boolean", "integer", "array"],
                answer: "integer"
            },
            {
                explanation: "Variables are containers for storing data values in JavaScript. You declare variables with the `var`, `let`, or `const` keywords.",
                question: "Which keyword declares a variable that cannot be reassigned?",
                options: ["var", "let", "const", "declare"],
                answer: "const"
            },
            {
                explanation: "Functions are blocks of code designed to perform a specific task. They are executed when they are called (invoked).",
                question: "Which of the following is the correct syntax to declare a function in JavaScript?",
                options: ["function = myFunction() {}", "function myFunction() {}", "myFunction = function() {}", "myFunction() = {}"],
                answer: "function myFunction() {}"
            },
            {
                explanation: "Conditional statements are used to perform different actions based on different conditions. `if`, `else if`, and `else` are used in JavaScript to implement conditional logic.",
                question: "Which statement is used to execute code if a specified condition is true?",
                options: ["else if", "if", "else", "for"],
                answer: "if"
            },
            {
                explanation: "Arrays are used to store multiple values in a single variable. They are indexed starting from 0 and can contain any data type.",
                question: "Which method adds one or more elements to the end of an array and returns the new length of the array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                answer: "push()"
            }
        ];

        let totalScore = 0;

        terminal.printLine("Welcome to Learn JavaScript!");
        terminal.printLine("Type your answer or type 'exit' to leave.");

        for (const step of jsTutorial) {
            terminal.printLine(step.explanation);
            const optionsString = step.options.map((option, index) => `${index + 1}. ${option}`).join("\n");
            terminal.printLine(`\n${step.question}\n${optionsString}`);

            const userInput = await promptUser("Type the number of your answer or type 'exit' to leave:");

            if (userInput === 'exit') {
                terminal.printLine("Exiting Learn JavaScript. See you next time!");
                return;
            }

            const userAnswerIndex = parseInt(userInput) - 1;
            const userAnswer = step.options[userAnswerIndex];

            if (userAnswer && userAnswer.toLowerCase() === step.answer.toLowerCase()) {
                terminal.printLine("Correct answer!\n");
                totalScore++;
            } else {
                terminal.printLine(`Incorrect answer. The correct answer is: ${step.answer}\n`);
            }

            await promptUser("Press Enter to continue...");
        }

        terminal.printLine(`Congratulations! You have completed the Learn JavaScript tutorial.`);
        terminal.printLine(`Your total score is: ${totalScore}/${jsTutorial.length}`);

        const continueLearning = await promptUser("Do you want to continue learning? (yes/no)");

        if (continueLearning === 'yes') {
            this.execute(args, terminal); // Restart the tutorial
        } else {
            terminal.printLine("Exiting Learn JavaScript. See you next time!");
        }
    },
    description: 'Interactive tutorial for learning JavaScript with explanations and multiple-choice questions',
};


