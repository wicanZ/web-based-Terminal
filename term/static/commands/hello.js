export default {
    execute: function(args , terminal ) {
        terminal.printLine(`Hello, ${args.join(" ") || "World"}!`);
    },
    description: "Greets the user with 'Hello, World!' or a specified name."
};