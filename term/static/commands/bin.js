export default {
    execute: function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine("Usage: bin <number>");
            return;
        }
        const number = parseInt(args[0]);
        if (isNaN(number)) {
            terminal.printLine("Invalid number");
            return;
        }
        terminal.printLine(`${number} in binary is ${number.toString(2)}`);
    },
    description: 'Convert a number to binary'
};
