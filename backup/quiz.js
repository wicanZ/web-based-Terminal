export default {
    execute: async function(args, terminal) {
        const promptUser = (question, hideInput = false) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback; // Restore original callback
                    terminal.inputElement.type = 'text'; // Reset input type
                    resolve(input.trim());
                };
                terminal.print(question);
                if (hideInput) {
                    terminal.inputElement.type = 'password';
                }
            });
        };

        const quizQuestions = [
            {
                question: "What is XSS?",
                options: ["Cross-Site Scripting", "Cross-Site Style", "Cross-Site Storage", "Cross-Site Sheet"],
                answer: "Cross-Site Scripting"
            },
            {
                question: "What does SQL stand for?",
                options: ["Structured Query Language", "Structured Question Language", "Simple Query Language", "Simple Question Language"],
                answer: "Structured Query Language"
            },
            {
                question: "Which of these is a type of malware?",
                options: ["Virus", "Firewall", "Antivirus", "Router"],
                answer: "Virus"
            },
            {
                question: "What is phishing?",
                options: ["A type of social engineering attack", "A type of virus", "A firewall technique", "A database management system"],
                answer: "A type of social engineering attack"
            },
            {
                question: "What does SSL stand for?",
                options: ["Secure Sockets Layer", "Secure Software Layer", "Secure Security Layer", "Secure Signal Layer"],
                answer: "Secure Sockets Layer"
            }
        ];

        const checkLoginStatus = () => {
            const isLoggedIn = localStorage.getItem('is_logged_in');
            const username = localStorage.getItem('username');
            return { isLoggedIn, username };
        };

        const login = async () => {
            const username = await promptUser('Enter username: ');
            const password = await promptUser('Enter password: ', true);

            const response = await fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    terminal.printLine('Login successful!');
                    localStorage.setItem('is_logged_in', true);
                    localStorage.setItem('username', username);
                    return { isLoggedIn: true, username };
                } else {
                    terminal.printLine('Login failed: ' + result.message);
                }
            } else {
                terminal.printLine('Error: Unable to reach the server.');
            }
            return { isLoggedIn: false, username: null };
        };

        const startQuiz = async (username) => {
            let score = 0;
            for (const questionObj of quizQuestions) {
                terminal.printLine(questionObj.question);
                questionObj.options.forEach((option, index) => {
                    terminal.printLine(`${index + 1}. ${option}`);
                });

                const answerPromise = new Promise(resolve => {
                    const intervalId = setInterval(() => {
                        terminal.printLine('Time is up!');
                        resolve(null);
                    }, 15000);

                    terminal.inputCallback = (input) => {
                        clearInterval(intervalId);
                        resolve(input.trim());
                    };
                });

                const answer = await answerPromise;

                const answerIndex = parseInt(answer) - 1;
                if (answer && questionObj.options[answerIndex] === questionObj.answer) {
                    score += 3;
                }
            }

            const response = await fetch('/save_quiz_result/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, score }),
            });

            if (response.ok) {
                terminal.printLine(`Quiz completed! Your score: ${score}`);
            } else {
                terminal.printLine('Error: Unable to save quiz results.');
            }
        };

        let { isLoggedIn, username } = checkLoginStatus();

        if (!isLoggedIn) {
            terminal.printLine('Please log in to attempt the quiz.');
            ({ isLoggedIn, username } = await login());
        }

        if (isLoggedIn) {
            const response = await fetch('/get_quiz_start_time/');
            if (response.ok) {
                const result = await response.json();
                const quizStartTime = new Date(result.start_time);
                const now = new Date();

                if (quizStartTime > now) {
                    terminal.printLine(`Quiz will start at: ${quizStartTime}`);
                } else if (quizStartTime <= now) {
                    terminal.printLine('Quiz is starting now!');
                    await startQuiz(username);
                } else {
                    terminal.printLine('The quiz has already started or finished.');
                }
            } else {
                terminal.printLine('Error: Unable to fetch quiz start time.');
            }
        }
    },
    description: 'Attempt a 5-question security quiz. Requires login. Quiz starts at a scheduled time.'
};
