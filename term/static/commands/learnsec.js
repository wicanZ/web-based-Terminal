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

        const securityTutorial = [
            {
                topic: 'XSS',
                explanation: "Cross-Site Scripting (XSS) is a type of security vulnerability typically found in web applications. XSS allows attackers to inject malicious scripts into web pages viewed by other users.",
                question: "What is a common way to prevent XSS attacks?",
                options: ["Sanitizing user input", "Disabling JavaScript", "Using HTTPS", "Disabling cookies"],
                answer: "Sanitizing user input"
            },
            {
                topic: 'XSS',
                explanation: "There are several types of XSS attacks, including stored XSS, reflected XSS, and DOM-based XSS.",
                question: "Which type of XSS is also known as persistent XSS?",
                options: ["Stored XSS", "Reflected XSS", "DOM-based XSS", "Non-persistent XSS"],
                answer: "Stored XSS"
            },
            {
                topic: 'SQL Injection',
                explanation: "SQL Injection is a code injection technique that might destroy your database. It is one of the most common web hacking techniques.",
                question: "What does an attacker typically manipulate in a SQL injection attack?",
                options: ["SQL queries", "HTML structure", "CSS styles", "JavaScript code"],
                answer: "SQL queries"
            },
            {
                topic: 'SQL Injection',
                explanation: "Prepared statements and parameterized queries are effective against SQL injection attacks.",
                question: "Which of the following is a method to prevent SQL injection?",
                options: ["Using prepared statements", "Disabling cookies", "Using HTTPS", "Sanitizing HTML output"],
                answer: "Using prepared statements"
            },
            {
                topic: 'Web Security',
                explanation: "HTTP Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP). It is used for secure communication over a computer network.",
                question: "What does HTTPS stand for?",
                options: ["HyperText Transfer Protocol Secure", "Hyper Transfer Text Protocol Secure", "HyperText Transfer Protocol Standard", "Hyper Transfer Text Protocol Standard"],
                answer: "HyperText Transfer Protocol Secure"
            },
            {
                topic: 'Web Security',
                explanation: "Content Security Policy (CSP) is a security standard introduced to prevent a range of attacks, including Cross-Site Scripting (XSS) and data injection attacks.",
                question: "What is the primary purpose of Content Security Policy (CSP)?",
                options: ["To control resources the browser is allowed to load for a given page", "To manage user sessions", "To secure database connections", "To handle authentication and authorization"],
                answer: "To control resources the browser is allowed to load for a given page"
            },
            {
                topic: 'Digital Forensics',
                explanation: "Digital forensics is a branch of forensic science encompassing the recovery and investigation of material found in digital devices.",
                question: "Which of the following is NOT a step in the digital forensics process?",
                options: ["Collection", "Examination", "Fabrication", "Analysis"],
                answer: "Fabrication"
            },
            {
                topic: 'Digital Forensics',
                explanation: "Chain of custody refers to the chronological documentation that records the sequence of custody, control, transfer, analysis, and disposition of physical or electronic evidence.",
                question: "Why is maintaining a chain of custody important in digital forensics?",
                options: ["To ensure the evidence is admissible in court", "To encrypt the evidence", "To increase the evidence size", "To decrypt the evidence"],
                answer: "To ensure the evidence is admissible in court"
            },
            {
                topic: 'Malware',
                explanation: "Malware is software specifically designed to disrupt, damage, or gain unauthorized access to a computer system.",
                question: "Which type of malware disguises itself as legitimate software?",
                options: ["Trojan Horse", "Worm", "Virus", "Ransomware"],
                answer: "Trojan Horse"
            },
            {
                topic: 'Malware',
                explanation: "Ransomware is a type of malware that threatens to publish the victim's data or perpetually block access to it unless a ransom is paid.",
                question: "What is the main goal of ransomware?",
                options: ["To extort money from the victim", "To delete all files on the system", "To install spyware", "To open a backdoor"],
                answer: "To extort money from the victim"
            }
        ];

        let totalScore = 0;

        terminal.printLine("Welcome to Learn Security!");
        terminal.printLine("Type the number of your answer or type 'exit' to leave.");

        for (const step of securityTutorial) {
            terminal.printLine(`${step.topic}: ${step.explanation}`);
            const optionsString = step.options.map((option, index) => `${index + 1}. ${option}`).join("\n");
            terminal.printLine(`\n${step.question}\n${optionsString}`);

            const userInput = await promptUser("Type the number of your answer or type 'exit' to leave:");

            if (userInput === 'exit') {
                terminal.printLine("Exiting Learn Security. See you next time!");
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
        }

        terminal.printLine(`Congratulations! You have completed the Learn Security tutorial.`);
        terminal.printLine(`Your total score is: ${totalScore}/${securityTutorial.length}`);

        const continueLearning = await promptUser("Do you want to continue learning? (yes/no)");

        if (continueLearning === 'yes') {
            this.execute(args, terminal); // Restart the tutorial
        } else {
            terminal.printLine("Exiting Learn Security. See you next time!");
        }
    },
    description: 'Interactive tutorial for learning security topics with explanations and multiple-choice questions',
};
