export default {
    execute: async function(args, terminal) {
        const container = document.createElement('div');
        container.id = 'typing-game-container';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #000';
        container.style.zIndex = '1000';
        container.style.padding = '20px';
        container.style.boxSizing = 'border-box';

        const textArea = document.createElement('textarea');
        textArea.id = 'typing-game-textarea';
        textArea.style.width = '100%';
        textArea.style.height = '80%';
        textArea.style.fontSize = '20px';

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Typing Game';
        startButton.style.display = 'block';
        startButton.style.margin = '20px auto';

        container.appendChild(textArea);
        container.appendChild(startButton);
        document.body.appendChild(container);

        // Disable terminal input
        terminal.inputElement.disabled = true;

        // Add event listener to close the game on Esc key press
        const closeGame = (event) => {
            if (event.key === 'Escape' || event.key === 'c') {
                document.body.removeChild(container);
                terminal.inputElement.disabled = false;
                terminal.inputElement.focus();
                document.removeEventListener('keydown', closeGame);
            }
        };

        document.addEventListener('keydown', closeGame);

        // Typing game logic
        const sampleText = "The quick brown fox jumps over the lazy dog.";
        textArea.value = sampleText;

        startButton.addEventListener('click', () => {
            textArea.focus();
            textArea.select();
            textArea.addEventListener('input', (event) => {
                const currentText = textArea.value;
                if (currentText === sampleText) {
                    alert('Congratulations! You completed the typing game.');
                    document.body.removeChild(container);
                    terminal.inputElement.disabled = false;
                    terminal.inputElement.focus();
                }
            });
        });
    },
    description: 'Play a typing game'
};
