export default {
    execute: async function(args, terminal) {
        if (args.length === 0) {
            throw new Error("You must specify a command to view the manual.");
        }

        const commandName = args[0];
        if (!terminal.commandExists(commandName)) {
            throw new Error(`No manual entry for ${commandName}`);
        }

        const command = await terminal.loadCommand(commandName);
        if (commandName === "man") {
            terminal.printEasterEgg("manmanEgg");
            terminal.addLineBreak();
        }

        const infoTableData = [
            ["name", commandName],
            ["description", command.description || "No description available"],
            ["author", command.author || "Unknown"],
            ["is a game", command.info && command.info.isGame ? "yes" : "no"],
            ["is secret", command.info && command.info.isSecret ? "yes" : "no"]
        ];

        const hasArgs = command.args && Object.keys(command.args).length > 0;

        if (!hasArgs) {
            infoTableData.push(["arguments", "doesn't accept any arguments"]);
        }

        terminal.printTable(infoTableData);

        if (hasArgs) {
            const argTableData = [];
            const argOptions = Object.entries(command.args);
            for (const [arg, description] of argOptions) {
                argTableData.push([
                    arg, description.optional ? "yes" : "no",
                    description.description || "No description available",
                    description.type || "Unknown",
                    description.default || "/"
                ]);
            }

            terminal.addLineBreak();
            terminal.printTable(argTableData, ["Argument", "Optional", "Description", "Type", "Default"]);
        }
    },
    description: "Show the manual page for a command",
    args: { "command:c": "The command to show the manual page for" },
    helpVisible: true
};
