export default {
    execute: async function(args, terminal) {
        terminal.displayOutput('Starting Matrix effect...');

        // Create canvas for matrix effect
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = terminal.element.clientWidth;
        canvas.height = terminal.element.clientHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '0';  // Ensure canvas is behind text
        canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';  // Dark background
        terminal.element.appendChild(canvas);

        // Matrix effect parameters
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array.from({ length: columns }).map(() => 1);
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        // Matrix effect loop
        let running = true;
        const matrixInterval = setInterval(() => {
            if (!running) {
                clearInterval(matrixInterval);
                canvas.parentNode.removeChild(canvas); // Remove canvas from DOM
                return;
            }

            context.fillStyle = 'rgba(0, 255, 0, 0.8)';  // Bright green text
            context.font = `${fontSize}px monospace`;

            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                context.fillText(text, i * fontSize, y * fontSize);

                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            });
        }, 33);

        // Function to stop the Matrix effect
        function stopMatrix() {
            running = false;
            terminal.displayOutput('Matrix effect stopped.');
        }

        // Register stop command
        terminal.addCommand({
            execute: function(args, terminal) {
                if (args[0] === 'stop') {
                    stopMatrix();
                } else {
                    terminal.displayOutput('Invalid command. Use "cmatrix stop" to stop the Matrix effect.');
                }
            },
            description: 'Stop the Matrix effect',
        });

        // Handle terminal exit
        const exitHandler = (event) => {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                clearInterval(matrixInterval);
                canvas.parentNode.removeChild(canvas); // Remove canvas from DOM
                terminal.inputElement.disabled = false;
                terminal.inputElement.focus();
                document.removeEventListener('keydown', exitHandler);
            }
        };
        document.addEventListener('keydown', exitHandler);

        // Display instructions to stop the matrix effect
        
    },
    description: 'Displays a Matrix-style animation. Use "ctrl or esc key" to stop it.'
};
