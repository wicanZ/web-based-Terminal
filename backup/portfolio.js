// ./commands/portfolio.js

export default {
    execute: async function(args, terminal) {
        // Utility function to prompt the user for input
        const promptUser = (question) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback; // Restore original callback
                    resolve(input.trim());
                };
                terminal.print(question);
            });
        };

        // Function to store portfolio data in localStorage
        const storeData = (data) => {
            localStorage.setItem('portfolioData', JSON.stringify(data));
        };

        // Function to retrieve portfolio data from localStorage
        const retrieveData = () => {
            const data = localStorage.getItem('portfolioData');
            return data ? JSON.parse(data) : null;
        };

        // Function to remove portfolio data from localStorage
        const removeData = () => {
            localStorage.removeItem('portfolioData');
        };

        // Function to display the portfolio content
        const displayPortfolio = ({ name, bio, date, projects }) => {
            return `
${name}'s Portfolio
===============================
About Me
--------
${bio}

Projects
--------
${projects.map(project => `- ${project.name}: ${project.description}`).join('\n')}

Date Created
------------
${date}

Controls
--------
1. Press 'e' to edit portfolio
2. Press 'r' to remove portfolio
3. Press 'c' to copy portfolio data
4. Press 'esc' to return to command input
            `;
        };

        // Handle different subcommands
        const subcommand = args[0];
        switch (subcommand) {
            case 'create':
                const name = await promptUser('Enter your name: ');
                const bio = await promptUser('Enter a short bio: ');
                const projectCount = parseInt(await promptUser('How many projects do you want to add? '), 10);
                const projects = [];
                for (let i = 0; i < projectCount; i++) {
                    const projectName = await promptUser(`Enter the name of project ${i + 1}: `);
                    const projectDescription = await promptUser(`Enter a short description of project ${i + 1}: `);
                    projects.push({ name: projectName, description: projectDescription });
                }
                const date = new Date().toLocaleDateString();

                const portfolioData = { name, bio, date, projects };
                storeData(portfolioData);
                terminal.printLine('Portfolio created successfully.');
                break;

            case 'edit':
                const storedData = retrieveData();
                if (storedData) {
                    const newName = await promptUser(`Enter your name (${storedData.name}): `) || storedData.name;
                    const newBio = await promptUser(`Enter a short bio (${storedData.bio}): `) || storedData.bio;
                    const newProjectCount = parseInt(await promptUser('How many projects do you want to add or edit? '), 10);
                    const newProjects = [];
                    for (let i = 0; i < newProjectCount; i++) {
                        const newProjectName = await promptUser(`Enter the name of project ${i + 1}: `);
                        const newProjectDescription = await promptUser(`Enter a short description of project ${i + 1}: `);
                        newProjects.push({ name: newProjectName, description: newProjectDescription });
                    }

                    const newPortfolioData = { name: newName, bio: newBio, date: storedData.date, projects: newProjects };
                    storeData(newPortfolioData);
                    terminal.printLine('Portfolio updated successfully.');
                } else {
                    terminal.printLine('No portfolio data found. Please create a new portfolio first.');
                }
                break;

            case 'remove':
                removeData();
                terminal.printLine('Portfolio data removed.');
                break;

            case 'display':
                const displayData = retrieveData();
                if (displayData) {
                    terminal.clear();
                    terminal.printLine(displayPortfolio(displayData));
                    terminal.inputCallback = (input) => {
                        switch (input.toLowerCase()) {
                            case 'e':
                                terminal.clear();
                                terminal.printLine('Editing portfolio...');
                                setTimeout(async () => {
                                    const name = await promptUser('Enter your name: ');
                                    const bio = await promptUser('Enter a short bio: ');
                                    const projectCount = parseInt(await promptUser('How many projects do you want to add? '), 10);
                                    const projects = [];
                                    for (let i = 0; i < projectCount; i++) {
                                        const projectName = await promptUser(`Enter the name of project ${i + 1}: `);
                                        const projectDescription = await promptUser(`Enter a short description of project ${i + 1}: `);
                                        projects.push({ name: projectName, description: projectDescription });
                                    }
                                    const date = new Date().toLocaleDateString();

                                    const portfolioData = { name, bio, date, projects };
                                    storeData(portfolioData);
                                    terminal.printLine('Portfolio edited successfully.');
                                    terminal.printLine('Press ESC to return to the command input.');
                                }, 0);
                                break;
                            case 'r':
                                removeData();
                                terminal.clear();
                                terminal.printLine('Portfolio data removed.');
                                terminal.printLine('Press ESC to return to the command input.');
                                break;
                            case 'c':
                                navigator.clipboard.writeText(JSON.stringify(displayData, null, 2)).then(() => {
                                    terminal.printLine('Portfolio data copied to clipboard.');
                                    terminal.printLine('Press ESC to return to the command input.');
                                });
                                break;
                            case 'esc':
                                terminal.clear();
                                terminal.printLine('You have returned to the command input.');
                                terminal.inputCallback = null;
                                break;
                            default:
                                terminal.printLine('Invalid command. Please use e, r, c, or esc.');
                                break;
                        }
                    };
                } else {
                    terminal.printLine('No portfolio data found. Please create a new portfolio first.');
                }
                break;

            default:
                terminal.printLine('Usage: portfolio [create|edit|remove|display]');
                break;
        }
    },
    description: 'Create, edit, remove, or display a portfolio website with your name, bio, and projects.'
};
