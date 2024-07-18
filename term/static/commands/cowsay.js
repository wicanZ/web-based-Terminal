export default {
    execute: function(args, terminal) {
        const message = args.join(' ') || 'Moo!';
        const cow = `
        ${'_'.repeat(message.length + 2)}
       < ${message} >
        ${'-'.repeat(message.length + 2)}
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||`;

        terminal.printLine(cow);
    },
    description: 'Display a cowsay message'
};
