// ./commands/sl.js

export default {
    execute: function(args, terminal) {
        const frames = [
            `
            🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
             🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
              🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
               🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
                🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
               🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
              🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
             🚂🚃🚃🚃🚃🚃🚃🚃
        `,
            `
            🚂🚃🚃🚃🚃🚃🚃🚃
        `,
        ];

        let currentFrame = 0;

        const animate = () => {
            terminal.clear();
            terminal.printLine(frames[currentFrame]);
            currentFrame = (currentFrame + 1) % frames.length;

            if (currentFrame !== 0) {
                setTimeout(animate, 200); // Adjust the speed as needed
            } else {
                terminal.printLine('Choo Choo!');
                terminal.inputCallback = null; // End the animation
            }
        };

        terminal.inputCallback = (input) => {
            if (input.toLowerCase() === 'esc' || input.toLowerCase() === 'exit' || input.toLowerCase() === 'ctrl+c') {
                terminal.clear();
                terminal.printLine('Animation stopped.');
                terminal.inputCallback = null;
            }
        };

        animate();
    },
    description: 'Run the steam locomotive animation.'
};
