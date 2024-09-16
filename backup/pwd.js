export default {
    execute: function(args, terminal) {
        const currentDir = localStorage.getItem('current_dir') || '/';
        terminal.printLine(currentDir);
    },
    description: 'Print the current working directory.'
};
