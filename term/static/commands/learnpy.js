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

        const pythonTutorial = [
            {
                explanation: "Python is a versatile programming language known for its simplicity and readability.",
                question: "Which keyword is used to define a function in Python?",
                options: ["def", "function", "func", "lambda"],
                answer: "def"
            },
            {
                explanation: "Variables in Python can store different types of data, such as integers, floats, and strings.",
                question: "How do you create a variable in Python?",
                options: ["x = 10", "int x = 10", "var x = 10", "create x = 10"],
                answer: "x = 10"
            },
            {
                explanation: "Python lists are used to store multiple items in a single variable.",
                question: "How do you create a list in Python?",
                options: ["myList = []", "myList = {}", "myList = ()", "myList = <>"],
                answer: "myList = []"
            },
            {
                explanation: "Conditional statements in Python allow you to execute different code based on certain conditions.",
                question: "How do you write an if statement in Python?",
                options: ["if x > 10:", "if (x > 10):", "if x > 10 then", "if x > 10 end"],
                answer: "if x > 10:"
            },
            {
                explanation: "Python supports loops to iterate over a sequence of elements.",
                question: "How do you write a for loop in Python?",
                options: ["for item in list:", "for item of list:", "foreach item in list:", "loop item in list:"],
                answer: "for item in list:"
            },{
                explanation: "Python is a high-level, interpreted programming language known for its simplicity and readability.",
                question: "Which of the following is NOT a valid Python data type?",
                options: ["integer", "float", "char", "boolean"],
                answer: "char"
            },
            {
                explanation: "Variables in Python are used to store data values. Python has no command for declaring a variable: like in JavaScript, they are created when you assign a value to them.",
                question: "Which keyword is used to declare a constant variable in Python?",
                options: ["var", "let", "const", "None of the above"],
                answer: "None of the above"
            },
            {
                explanation: "Python functions are defined using the `def` keyword. They are called using the function name followed by parentheses.",
                question: "Which of the following is the correct syntax to define a function in Python?",
                options: ["function myFunction():", "def myFunction():", "myFunction = function():", "define myFunction():"],
                answer: "def myFunction():"
            },
            {
                explanation: "Python supports if-else conditional statements for decision-making. Indentation is significant in Python.",
                question: "Which statement is used to execute a block of code only if a specified condition is true?",
                options: ["elseif", "if", "else", "for"],
                answer: "if"
            },
            {
                explanation: "Lists are used to store multiple items in a single variable. They are ordered, changeable, and allow duplicate values.",
                question: "Which method adds a new item to the end of a list?",
                options: ["append()", "insert()", "add()", "push()"],
                answer: "append()"
            }
        ];

        let totalScore = 0;

        terminal.printLine("Welcome to Learn Python!");
        terminal.printLine("Type your answer or type 'exit' to leave.");

        for (const step of pythonTutorial) {
            terminal.printLine(step.explanation);
            const optionsString = step.options.map((option, index) => `${index + 1}. ${option}`).join("\n");
            terminal.printLine(`\n${step.question}\n${optionsString}`);

            const userInput = await promptUser("Type the number of your answer or type 'exit' to leave:");

            if (userInput === 'exit') {
                terminal.printLine("Exiting Learn Python. See you next time!");
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

        terminal.printLine(`Congratulations! You have completed the Learn Python tutorial.`);
        terminal.printLine(`Your total score is: ${totalScore}/${pythonTutorial.length}`);

        const continueLearning = await promptUser("Do you want to continue learning? (yes/no)");

        if (continueLearning === 'yes') {
            this.execute(args, terminal); // Restart the tutorial
        } else {
            terminal.printLine("Exiting Learn Python. See you next time!");
        }
    },
    description: 'Interactive tutorial for learning Python with explanations and multiple-choice questions',
};















