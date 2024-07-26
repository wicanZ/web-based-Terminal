export default {
    execute: async function(args, terminal) {
        const animateTextLine = async (text, speed = 50) => {
            for (let char of text) {
                terminal.print(char);
                await new Promise(resolve => setTimeout(resolve, speed));
            }
            terminal.printLine('');
        };

        const promptUser = (question) => {
            return new Promise(resolve => {
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = null; // Clear input callback to prevent re-triggering
                    resolve(input.trim().toLowerCase());
                };
                terminal.printLine(question);
            });
        };

        const resumeSections = [
            {
                title: "Name",
                content: "John Doe"
            },
            {
                title: "Contact Information",
                content: "Email: john.doe@example.com\nPhone: (123) 456-7890\nLinkedIn: linkedin.com/in/johndoe"
            },
            {
                title: "Personal Profile",
                content: "Highly motivated and dedicated cybersecurity professional with a proven track record in protecting organizational assets and mitigating security risks. Adept at developing security protocols and conducting forensic investigations to uncover potential threats."
            },
            {
                title: "Summary",
                content: "Experienced cybersecurity professional with a strong background in penetration testing, web security, and digital forensics. Passionate about helping organizations protect their information assets and improve their security posture."
            },
            {
                title: "Skills",
                content: "Penetration Testing, Web Security, Digital Forensics, Malware Analysis, Network Security, Incident Response"
            },
            {
                title: "Experience",
                content: "Cybersecurity Analyst at SecureTech (2018-Present)\n- Conducted vulnerability assessments and penetration tests on client systems.\n- Provided incident response and forensic analysis for data breaches.\n\nSecurity Consultant at CyberSafe (2015-2018)\n- Delivered security awareness training and developed security policies for clients.\n- Performed web application security assessments and code reviews."
            },
            {
                title: "Education",
                content: "Bachelor of Computer Applications (BCA) from XYZ University (2012-2015)"
            },
            {
                title: "Certifications",
                content: "Certified Ethical Hacker (CEH)\nCertified Information Systems Security Professional (CISSP)"
            },
            {
                title: "Declaration",
                content: "I hereby declare that the information provided above is true to the best of my knowledge and belief."
            }
        ];

        terminal.printLine("Welcome to John Doe's Interactive Resume!");
        terminal.printLine("Type 'next' to view the next section, 'prev' to view the previous section, or 'exit' to leave.");

        let currentIndex = 0;

        while (true) {
            await animateTextLine(`\n${resumeSections[currentIndex].title}`);
            await animateTextLine(resumeSections[currentIndex].content);

            const userInput = await promptUser("Type 'next', 'prev', or 'exit':");

            if (userInput === 'exit') {
                terminal.printLine("Exiting Interactive Resume. Have a great day!");
                break;
            } else if (userInput === 'next') {
                currentIndex = (currentIndex + 1) % resumeSections.length;
            } else if (userInput === 'prev') {
                currentIndex = (currentIndex - 1 + resumeSections.length) % resumeSections.length;
            } else {
                terminal.printLine("Invalid input. Please type 'next', 'prev', or 'exit'.");
            }
        }
    },
    description: 'Interactive and animated resume of John Doe',
};
