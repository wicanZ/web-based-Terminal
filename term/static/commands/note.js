export default {
    notes: JSON.parse(localStorage.getItem('notes')) || [],

    saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    },

    execute: async function(args, terminal) {
        // Handle commands for adding, saving, and displaying notes
        const command = args[0];

        switch (command) {
            case 'add':
                // Add a new note
                const noteContent = args.slice(1).join(' ');
                if (noteContent) {
                    this.notes.push(noteContent);
                    this.saveNotesToLocalStorage();
                    terminal.displayOutput(`Note added: ${noteContent}`);
                } else {
                    terminal.displayOutput('Please provide note content.');
                }
                break;

            case 'save':
                // Save notes to a file using Blob
                if (this.notes.length > 0) {
                    const blob = new Blob([this.notes.join('\n')], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'notes.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                    terminal.displayOutput('Notes saved successfully.');
                } else {
                    terminal.displayOutput('No notes available to save.');
                }
                break;

            case 'show':
                // Display notes
                if (this.notes.length > 0) {
                    terminal.displayOutput('Notes:');
                    this.notes.forEach((note, index) => {
                        terminal.displayOutput(`${index + 1}: ${note}`);
                    });
                } else {
                    terminal.displayOutput('No notes available.');
                }
                break;

            default:
                terminal.displayOutput('Usage: note add [content], note save, note show');
        }
    },

    description: 'Manage notes with commands: add, save, show'
};
