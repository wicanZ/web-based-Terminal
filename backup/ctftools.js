// ./commands/ctf.js
export default {
    execute: async function(args, terminal) {
        const promptUser = (question) => {
            return new Promise(resolve => {
                terminal.inputCallback = (input) => {
                    if (input.trim().toLowerCase() === 'exit' || input.trim().toLowerCase() === 'esc') {
                        terminal.inputCallback = null;
                        resolve('exit');
                    } else {
                        terminal.inputCallback = null;
                        resolve(input.trim());
                    }
                };
                terminal.printLine(question);
            });
        };

        const tasks = {
            1: {
                name: "Programming Challenge",
                description: "Write a function named 'find_flag' that returns the string 'correct_flag'. Submit your code to get the flag.",
                flag: 'FLAG{programming_ctf_success}',
                validation: async (code, terminal) => {
                    const response = await fetch('/programming_challenge/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': terminal.getCookie('csrftoken')
                        },
                        body: JSON.stringify({ code: code })
                    });

                    const data = await response.json();
                    if (data.success) {
                        return data.flag;
                    } else {
                        terminal.printLine(`Error: ${data.message}`);
                        return null;
                    }
                }
            },
            2: {
                name: "File Search Challenge",
                description: "Find the hidden file in the /tmp directory. Use the command: ls /tmp",
                flag: 'FLAG{file_search_success}',
                validation: async (input, terminal) => {
                    const response = await fetch('/validate_file_search/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': terminal.getCookie('csrftoken')
                        },
                        body: JSON.stringify({ path: input })
                    });

                    const data = await response.json();
                    if (data.success) {
                        return data.flag;
                    } else {
                        terminal.printLine(`Error: ${data.message}`);
                        return null;
                    }
                }
            },
            3: {
                name: "XSS Challenge",
                description: "Exploit the XSS vulnerability on the search page. Inject a script to alert the flag.",
                flag: 'FLAG{xss_exploit_success}',
                validation: async (input, terminal) => {
                    const response = await fetch('/validate_xss/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': terminal.getCookie('csrftoken')
                        },
                        body: JSON.stringify({ payload: input })
                    });

                    const data = await response.json();
                    if (data.success) {
                        return data.flag;
                    } else {
                        terminal.printLine(`Error: ${data.message}`);
                        return null;
                    }
                }
            },
            4: {
                name: "Physical Security Challenge",
                description: "You are trapped in a room with a digital lock. The lock can be bypassed by entering a special sequence of digits that form a valid flag. Hint: The sequence should be a prime number. Solve the puzzle to get the flag.",
                flag: 'FLAG{physical_security_success}',
                validation: async (input, terminal) => {
                    const response = await fetch('/validate_physical_security/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': terminal.getCookie('csrftoken')
                        },
                        body: JSON.stringify({ sequence: input })
                    });

                    const data = await response.json();
                    if (data.success) {
                        return data.flag;
                    } else {
                        terminal.printLine(`Error: ${data.message}`);
                        return null;
                    }
                }
            },
            5: {
                name: "Brute Force Challenge",
                description: "A system is protected by a 4-digit PIN. Try to guess the PIN to get the flag. Use brute force techniques if necessary.",
                flag: 'FLAG{brute_force_success}',
                validation: async (input, terminal) => {
                    const response = await fetch('/validate_brute_force/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': terminal.getCookie('csrftoken')
                        },
                        body: JSON.stringify({ pin: input })
                    });

                    const data = await response.json();
                    if (data.success) {
                        return data.flag;
                    } else {
                        terminal.printLine(`Error: ${data.message}`);
                        return null;
                    }
                }
            },
            6: {
                name: "SQL Injection Challenge",
                description: "Exploit a SQL injection vulnerability to bypass the login and retrieve the flag.",
                flag: 'FLAG{sql_injection_success}',
                validation: async (input, terminal) => {
                    const response = await fetch('/validate_sql_injection/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': terminal.getCookie('csrftoken')
                        },
                        body: JSON.stringify({ injection: input })
                    });

                    const data = await response.json();
                    if (data.success) {
                        return data.flag;
                    } else {
                        terminal.printLine(`Error: ${data.message}`);
                        return null;
                    }
                }
            },
            7: {
                name: "Logic Puzzle Challenge",
                description: "Solve the following puzzle to get the flag: What has keys but can't open locks?",
                flag: 'FLAG{logic_puzzle_success}',
                validation: async (input, terminal) => {
                    if (input.toLowerCase() === 'piano' || input.toLowerCase() === 'keyboard') {
                        return 'FLAG{logic_puzzle_success}';
                    } else {
                        terminal.printLine('Incorrect answer. Try again!');
                        return null;
                    }
                }
            },
            8: {
                name: "Hash Cracking Challenge",
                description: "Crack the given hash: 5f4dcc3b5aa765d61d8327deb882cf99",
                flag: 'FLAG{hash_crack_success}',
                validation: async (input, terminal) => {
                    if (input === 'password') {
                        return 'FLAG{hash_crack_success}';
                    } else {
                        terminal.printLine('Incorrect input. Try again!');
                        return null;
                    }
                }
            },
            9: {
                name: "Reverse Engineering Challenge",
                description: "Reverse engineer the binary file provided to find the flag.",
                flag: 'FLAG{reverse_engineering_success}',
                validation: async (input, terminal) => {
                    if (input === 'FLAG{reverse_engineering_success}') {
                        return 'FLAG{reverse_engineering_success}';
                    } else {
                        terminal.printLine('Incorrect input. Try again!');
                        return null;
                    }
                }
            },
            10: {
                name: "Steganography Challenge",
                description: "Find the hidden message in the provided image file.",
                flag: 'FLAG{steganography_success}',
                validation: async (input, terminal) => {
                    if (input === 'hidden_message') {
                        return 'FLAG{steganography_success}';
                    } else {
                        terminal.printLine('Incorrect input. Try again!');
                        return null;
                    }
                }
            },
            11: {
                name: "Forensics Challenge",
                description: "Analyze the network traffic capture to find the flag.",
                flag: 'FLAG{forensics_success}',
                validation: async (input, terminal) => {
                    if (input === 'FLAG{forensics_success}') {
                        return 'FLAG{forensics_success}';
                    } else {
                        terminal.printLine('Incorrect input. Try again!');
                        return null;
                    }
                }
            },
            12: {
                name: "Web Exploitation Challenge",
                description: "Exploit the web application vulnerability to retrieve the flag.",
                flag: 'FLAG{web_exploitation_success}',
                validation: async (input, terminal) => {
                    if (input === 'FLAG{web_exploitation_success}') {
                        return 'FLAG{web_exploitation_success}';
                    } else {
                        terminal.printLine('Incorrect input. Try again!');
                        return null;
                    }
                }
            }
        };

        const selectChallenge = async () => {
            terminal.printLine("Welcome to Capture The Flag!");
            terminal.printLine("Choose a challenge from the list below:");

            for (const [key, task] of Object.entries(tasks)) {
                terminal.printLine(`${key}: ${task.name}`);
            }

            const challengeNumber = await promptUser("Enter the number of the challenge you want to attempt or type 'exit' to quit:");
            if (challengeNumber === 'exit') {
                terminal.printLine("Exiting CTF...");
                return;
            }

            const task = tasks[challengeNumber];
            if (!task) {
                terminal.printLine("Invalid challenge number. Please try again.");
                await selectChallenge();
                return;
            }

            await attemptChallenge(task);
        };

        const attemptChallenge = async (task) => {
            terminal.printLine(task.description);

            while (true) {
                const userInput = await promptUser("Enter your input/code or type 'exit' to go back:");
                if (userInput === 'exit') {
                    await selectChallenge();
                    return;
                }

                const flag = await task.validation(userInput, terminal);
                if (flag) {
                    const valid = await submitFlag(flag, task.flag, terminal);
                    if (valid) {
                        terminal.printLine(`Congratulations! Here is your flag: ${flag}`);
                        break;
                    } else {
                        terminal.printLine("Incorrect flag. Try again!");
                    }
                }
            }
        };

        const submitFlag = async (userFlag, expectedFlag, terminal) => {
            const response = await fetch('/submit_flag/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                },
                body: JSON.stringify({ user_flag: userFlag, expected_flag: expectedFlag })
            });

            const data = await response.json();
            return data.success;
        };

        await selectChallenge();
    },
    description: 'Play the Capture The Flag game by solving security challenges'
};
