export default {
    execute: async function(args, terminal) {
        terminal.clear();
        terminal.displayOutput('Starting SL...');

        // Create a container for the animation
        const trainContainer = document.createElement('div');
        trainContainer.id = 'train-container';
        trainContainer.style.position = 'absolute';
        trainContainer.style.top = '50%';
        trainContainer.style.left = '-100px'; // Start off-screen
        trainContainer.style.zIndex = '1000'; // Ensure it's on top of other elements
        terminal.element.appendChild(trainContainer);

        // ASCII art for the train
        const trainAscii = `
            _____
           /     \\________________
          /_____________________/|
          |  []   []   []   []  ||
          |  []   []   []   []  ||
__________|____________________|/_________
==============  TRSH  ================
        `;

        trainContainer.innerHTML = `<pre>${trainAscii}</pre>`;

        // Animation parameters
        const speed = 10; // Speed of the train in pixels per frame
        const interval = 50; // Interval between each frame

        let position = -100; // Initial position off-screen

        // Function to move the train
        const moveTrain = () => {
            position += speed;
            trainContainer.style.left = position + 'px';
            const width = window.innerWidth ;

            if (position > width - 450) {
                // Train has crossed the screen, reset position
                position = -100;
                trainContainer.style.left = position + 'px';
            }
        };

        // Start the animation loop
        const animationInterval = setInterval(moveTrain, interval);

        // Function to stop the animation and remove train from screen
        const stopAnimation = () => {
            clearInterval(animationInterval);
            terminal.element.removeChild(trainContainer);
            terminal.displayOutput('SL animation stopped.');
        };

        // Function to handle keyboard events
        const keydownHandler = (event) => {
            if (event.key === 'Escape') {
                stopAnimation();
                document.removeEventListener('keydown', keydownHandler);
            }
        };
        document.addEventListener('keydown', keydownHandler);

        // Provide instructions
        terminal.displayOutput('Press "Esc" to stop the SL animation');
    },
    description: 'Displays an SL-style train animation. Press "Esc" to stop it.',
};
