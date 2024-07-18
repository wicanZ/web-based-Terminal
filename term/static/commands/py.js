export default {
    execute: async function(args, terminal) {
        // Ensure Pyodide is loaded only once
        if (!terminal.pythonInterpreter) {
            terminal.pythonInterpreter = new PythonInterpreter(terminal);
            await terminal.pythonInterpreter.loadPyodideAndPackages();
        }

        // Enter Python mode
        terminal.pythonInterpreter.enterPythonMode();

        // If code is provided as arguments, execute it
        if (args.length > 0) {
            const code = args.join(" ");
            await terminal.pythonInterpreter.executePython(code);
        }
    },
    description: "Run a script or open a Python shell",
    args: {
        "?f=file:f": "The script file to run",
        "?c=code:s": "The Python code to run",
    },
    disableEqualsArgNotation: true
};
