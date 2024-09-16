export default {
    execute: function(args, terminal) {
        if (args.length < 2) {
            terminal.printLine("Usage: say <message> <pitch>");
            return;
        }

        const pitch = parseFloat(args.pop());
        if (isNaN(pitch) || pitch < 0 || pitch > 2) {
            terminal.printLine("Error: Invalid pitch. Please provide a value between 0 and 2.");
            return;
        }

        const message = args.join(" ");
        terminal.printLine(`Saying: "${message}" with pitch ${pitch}`);

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.pitch = pitch;
        speechSynthesis.speak(utterance);
    },
    description: 'Say a message with a specified pitch. Usage: say <message> <pitch>',
};
