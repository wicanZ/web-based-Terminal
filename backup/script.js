export default {
    execute: async function(args, terminal) {
        if (args.length < 1) {
            terminal.printLine("Usage: script <script-file-url>");
            return;
        }

        const scriptFileUrl = args[0];

        try {
            const response = await fetch(scriptFileUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const scriptContent = await response.text();
            const commands = scriptContent.split('\n').map(cmd => cmd.trim()).filter(cmd => cmd);

            for (const command of commands) {
                terminal.printLine(`Executing: ${command}`);
                await terminal.handleCommand(command);
            }
        } catch (error) {
            terminal.printLine(`Error executing script: ${error.message}`);
        }
    },
    description: 'Run a series of commands from a script file. Usage: script <script-file-url>',
};
