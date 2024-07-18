export default {
    execute: function(args , terminal) {
        terminal.outputElement.innerHTML = '';
        terminal.inputElement.value = '';
        terminal.printLine('screen clear!');
    },
    description: 'Clears the terminal screen and input field'
};