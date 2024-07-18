export default {
    execute: async function(args, terminal) {
        // Create and set up the canvas
        const canvas = document.createElement('canvas');
        canvas.width = terminal.outputElement.clientWidth;
        canvas.height = terminal.outputElement.clientHeight;
        terminal.outputElement.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // Hacker effect variables
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = Array.from({ length: columns }, () => 1);

        // Animation function
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        // Start the animation
        const interval = setInterval(draw, 33);

        // Stop the animation on user command
        const stopHackerEffect = () => {
            clearInterval(interval);
            terminal.outputElement.removeChild(canvas);
        };

        // Listen for escape key or ctrl+c to stop the animation
        const keydownListener = (event) => {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                stopHackerEffect();
                document.removeEventListener('keydown', keydownListener);
            }
        };
        document.addEventListener('keydown', keydownListener);
    },
    description: 'Simulate hacker text animation'
};
