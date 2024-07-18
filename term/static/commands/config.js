export default {
    execute: function(args, terminal) {
        const [key, ...value] = args;
        const valueStr = value.join(' ');

        if (key && valueStr) {
            terminal.config[key] = valueStr;
            terminal.displayOutput(`Config ${key} set to ${valueStr}`);
        } else {
            terminal.displayOutput('Usage: config <key> <value>');
        }
    },
    description: 'Set configuration options for the terminal'
};
