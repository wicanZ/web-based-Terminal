export default {
    // Utility to print styled borders
    printBorder(terminal, length) {
        const border = '-'.repeat(length);
        terminal.printLine(`<span style="color: lightblue;">${border}</span>`);
    },

    // Utility to print the header for each section
    printHeader(terminal, text) {
        terminal.printLine(`<span style="color: yellow; font-weight: bold;">${text}</span>`);
    },

    // Utility to print content with color
    printContent(terminal, label, content, color = 'lightgreen') {
        terminal.printLine(
            `<span style="color: lightcoral; font-weight: bold;">${label}: </span><span style="color: ${color};">${content}</span>`
        );
    },

    // List all reports with enhanced styling
    async listReports(terminal) {
        try {
            const response = await fetch('/api/reports/');
            if (response.ok) {
                const reports = await response.json();
                if (reports.length === 0) {
                    terminal.printLine('<span style="color: lightcoral;">No reports found.</span>');
                } else {
                    this.printHeader(terminal, 'Reports List:');
                    reports.forEach(report => {
                        this.printBorder(terminal, 40);
                        this.printContent(terminal, 'ID', report.id);
                        this.printContent(terminal, 'Line', report.line_number);
                        this.printContent(terminal, 'Date', report.created_at, 'lightyellow');
                        this.printContent(terminal, 'Content', report.content, 'lightblue');
                        this.printBorder(terminal, 40);
                        terminal.printLine('<br>');
                    });
                }
            } else {
                terminal.printLine('<span style="color: red;">Error fetching reports.</span>');
            }
        } catch (error) {
            terminal.printLine(`<span style="color: red;">Error: ${error.message}</span>`);
        }
    },

    // Add a new report by prompting the user for content and line number with enhanced styling
    async addReport(terminal) {
        const promptUser = (message) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback;  // Reset callback
                    resolve(input.trim());
                };
                terminal.printLine(`<span style="color: lightyellow;">${message}</span>`);
            });
        };

        // Get report content from user
        const content = await promptUser('Please enter your report content:');
        if (!content) {
            terminal.printLine('<span style="color: red;">Report content cannot be empty.</span>');
            return;
        }

        // Get line number from user
        const lineInput = await promptUser('Please enter the line number (default: 1):');
        const lineNumber = parseInt(lineInput) || 1;  // Default line number is 1

        try {
            const response = await fetch('/api/submit-report/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                },
                body: JSON.stringify({
                    content: content,
                    line_number: lineNumber
                })
            });

            if (response.ok) {
                const data = await response.json();
                terminal.printLine(`<span style="color: lightgreen;">Report submitted successfully!</span> <span style="color: lightblue;">Report ID: ${data.id}</span>`);
            } else {
                const errorData = await response.json();
                terminal.printLine(`<span style="color: red;">Error: ${errorData.error}</span>`);
            }
        } catch (error) {
            terminal.printLine(`<span style="color: red;">Error submitting report: ${error.message}</span>`);
        }
    },

    // Edit (retrieve) a single report by its ID with enhanced styling
    async editReport(terminal, reportId) {
        try {
            const response = await fetch(`/api/report/${reportId}/`);
            if (response.ok) {
                const report = await response.json();
                this.printHeader(terminal, `Report Details (ID: ${report.id})`);
                this.printBorder(terminal, 40);
                this.printContent(terminal, 'ID', report.id);
                this.printContent(terminal, 'Line', report.line_number);
                this.printContent(terminal, 'Date', report.created_at, 'lightyellow');
                this.printContent(terminal, 'Content', report.content, 'lightblue');
                this.printBorder(terminal, 40);
                terminal.printLine('<br>');
            } else {
                terminal.printLine('<span style="color: red;">Error fetching report.</span>');
            }
        } catch (error) {
            terminal.printLine(`<span style="color: red;">Error: ${error.message}</span>`);
        }
    },

    // Update a report by its ID, with new content and line number, with enhanced styling
    async updateReport(terminal, reportId, newContent, newLineNumber) {
        try {
            const response = await fetch(`/api/report/update/${reportId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                },
                body: JSON.stringify({
                    content: newContent,
                    line_number: newLineNumber
                })
            });

            if (response.ok) {
                const data = await response.json();
                terminal.printLine(`<span style="color: lightgreen;">${data.message}</span>`);
            } else {
                terminal.printLine('<span style="color: red;">Error updating report.</span>');
            }
        } catch (error) {
            terminal.printLine(`<span style="color: red;">Error: ${error.message}</span>`);
        }
    },

    // Delete a report by its ID with enhanced styling
    async deleteReport(terminal, reportId) {
        try {
            const response = await fetch(`/api/report/delete/${reportId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': terminal.getCookie('csrftoken')
                }
            });

            if (response.ok) {
                const data = await response.json();
                terminal.printLine(`<span style="color: lightgreen;">${data.message}</span>`);
            } else {
                terminal.printLine('<span style="color: red;">Error deleting report.</span>');
            }
        } catch (error) {
            terminal.printLine(`<span style="color: red;">Error: ${error.message}</span>`);
        }
    },

    // Display help for the report command
    async displayHelp(terminal) {
        this.printHeader(terminal, 'Report Command Help');
        terminal.printLine('<span style="color: lightyellow;">Here are the available subcommands for the report command:</span>');
        this.printBorder(terminal, 40);
        terminal.printLine('<span style="color: lightgreen;"><strong>report list</strong></span> - List all reports');
        terminal.printLine('<span style="color: lightgreen;"><strong>report add</strong></span> - Add a new report (prompts for content and line number)');
        terminal.printLine('<span style="color: lightgreen;"><strong>report edit &lt;report_id&gt;</strong></span> - View details of a specific report by its ID');
        terminal.printLine('<span style="color: lightgreen;"><strong>report update &lt;report_id&gt; &lt;new_content&gt; [new_line_number]</strong></span> - Update a specific report with new content and an optional line number');
        terminal.printLine('<span style="color: lightgreen;"><strong>report delete &lt;report_id&gt;</strong></span> - Delete a report by its ID');
        this.printBorder(terminal, 40);
    },

    // Handle the report command with various sub-commands (list, add, edit, update, delete, help)
    async execute(args, terminal) {
        const action = args[0];
        const reportId = parseInt(args[1], 10);  // For actions that need report ID

        switch (action) {
            case 'list':
                await this.listReports(terminal);
                break;

            case 'add':
                await this.addReport(terminal);
                break;

            case 'edit':
                if (!reportId) {
                    terminal.printLine('<span style="color: red;">Please provide a valid report ID.</span>');
                } else {
                    await this.editReport(terminal, reportId);
                }
                break;

            case 'update':
                if (!reportId || !args[2]) {
                    terminal.printLine('<span style="color: red;">Please provide a valid report ID and new content.</span>');
                } else {
                    const newContent = args.slice(2).join(' ');
                    const newLineNumber = args[3] || 1;  // Optional, defaults to 1 if not provided
                    await this.updateReport(terminal, reportId, newContent, newLineNumber);
                }
                break;

            case 'delete':
                if (!reportId) {
                    terminal.printLine('<span style="color: red;">Please provide a valid report ID.</span>');
                } else {
                    await this.deleteReport(terminal, reportId);
                }
                break;

            case 'help':
                await this.displayHelp(terminal);
                break;

            default:
                terminal.printLine('<span style="color: red;">Unknown report command. Use <strong>help</strong> to see available commands.</span>');
        }
    }
};
