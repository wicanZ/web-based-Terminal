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

        const hackingTools = {
            'nmap': [
                {
                    explanation: "Nmap is a network scanning tool used to discover hosts and services on a computer network.",
                    question: "Which Nmap command is used to perform a ping scan on a network?",
                    options: ["nmap -sP 192.168.1.0/24", "nmap -p 80 192.168.1.1", "nmap -A 192.168.1.1", "nmap -T4 192.168.1.1"],
                    answer: "nmap -sP 192.168.1.0/24"
                },
                {
                    explanation: "Nmap can also perform service version detection using the `-sV` option to determine versions of services running on open ports.",
                    question: "Which Nmap option is used to detect versions of services running on open ports?",
                    options: ["-sS", "-sV", "-sA", "-sU"],
                    answer: "-sV"
                }
            ],
            'metasploit': [
                {
                    explanation: "Metasploit is a penetration testing framework that helps find vulnerabilities in systems and exploit them.",
                    question: "Which of the following is NOT a module available in Metasploit?",
                    options: ["exploit", "payload", "defense", "auxiliary"],
                    answer: "defense"
                },
                {
                    explanation: "Metasploit modules can be used to run exploits against vulnerable systems or perform post-exploitation tasks.",
                    question: "Which Metasploit command is used to search for available modules?",
                    options: ["search", "find", "exploit", "use"],
                    answer: "search"
                }
            ],
            'sqlmap': [
                {
                    explanation: "Sqlmap is an open-source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws.",
                    question: "Which option in sqlmap is used to specify a vulnerable URL?",
                    options: ["-u", "-p", "-v", "-d"],
                    answer: "-u"
                },
                {
                    explanation: "Sqlmap supports various database management systems including MySQL, PostgreSQL, and Oracle.",
                    question: "Which database management system (DBMS) is NOT supported by sqlmap?",
                    options: ["MySQL", "MongoDB", "PostgreSQL", "Oracle"],
                    answer: "MongoDB"
                }
            ]
            // Add more tools and their explanations/questions as needed
        };

        let totalScore = 0;

        terminal.printLine("Welcome to Learn Hacking Tools!");
        terminal.printLine("Type your answer or type 'exit' to leave.");

        for (const tool in hackingTools) {
            terminal.printLine(`Tool: ${tool}`);
            const steps = hackingTools[tool];

            for (const step of steps) {
                terminal.printLine(step.explanation);
                const optionsString = step.options.map((option, index) => `${index + 1}. ${option}`).join("\n");
                terminal.printLine(`\n${step.question}\n${optionsString}`);
                
                const userInput = await promptUser("Type the number of your answer or type 'exit' to leave:");

                if (userInput === 'exit') {
                    terminal.printLine("Exiting Learn Hacking Tools. See you next time!");
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
        }

        terminal.printLine(`Congratulations! You have completed the Learn Hacking Tools tutorial.`);
        terminal.printLine(`Your total score is: ${totalScore}/${Object.keys(hackingTools).length * 2}`);

        const continueLearning = await promptUser("Do you want to continue learning? (yes/no)");

        if (continueLearning === 'yes') {
            this.execute(args, terminal); // Restart the tutorial
        } else {
            terminal.printLine("Exiting Learn Hacking Tools. See you next time!");
        }
    },
    description: 'Interactive tutorial for learning about hacking tools with explanations and multiple-choice questions',
};
